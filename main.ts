import { Env as SponsorflareEnv, getSponsor, middleware } from "sponsorflare";
import indexHtml from "./index.html";

interface Env extends SponsorflareEnv {
  deepseekApiKey: string;
  anthropicApiKey: string;
  openaiApiKey: string;
  groqApiKey: string;
}

interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const providers = {
      deepseek: {
        llmApiKey: env.deepseekApiKey,
        llmBasePath: "https://api.deepseek.com/v1",
      },
      anthropic: { llmApiKey: env.anthropicApiKey, llmBasePath: "" },
      openai: { llmApiKey: env.openaiApiKey, llmBasePath: "" },
      groq: { llmApiKey: env.groqApiKey, llmBasePath: "" },
    };

    const providerForModels: { [key: string]: keyof typeof providers } = {
      "deepseek-chat": "deepseek",
      "deepseek-reasoner": "deepseek",
    };

    const url = new URL(request.url);

    const sponsorflare = await middleware(request, env);
    if (sponsorflare) return sponsorflare;
    const sponsor = await getSponsor(request, env);

    if (url.pathname === "/") {
      return new Response(
        indexHtml.replace(
          "<script>",
          `<script>\nwindow.data = ${JSON.stringify({ sponsor })};\n\n`,
        ),
        { headers: { "content-type": "text/html" } },
      );
    }

    const { spent, clv, is_authenticated } = sponsor;
    const budget = (clv || 0) - (spent || 0);

    if (!is_authenticated) {
      return new Response("Unauthenticated", { status: 401 });
    }

    if (budget < -100) {
      return new Response("Payment required", {
        status: 402,
        headers: { "x-payment-url": "https://github.com/sponsors/janwilmake" },
      });
    }

    if (
      request.method !== "POST" ||
      !request.url.endsWith("/chat/completions")
    ) {
      return new Response("Not Found", { status: 404 });
    }

    try {
      const requestBody: { model: string } = await request.json();

      if (!requestBody.model) {
        return new Response("Missing model", { status: 400 });
      }
      const provider =
        providerForModels[requestBody.model as keyof typeof providerForModels];
      if (!provider) {
        return new Response("Model not supported", { status: 400 });
      }

      const { llmApiKey, llmBasePath } =
        providers[provider as keyof typeof providers];
      if (!llmApiKey || !llmBasePath) {
        return new Response("Missing API Key", { status: 500 });
      }

      // Forward the request to chatcompletions.com
      const response = await fetch(
        "https://chatcompletions.com/chat/completions",
        {
          method: "POST",
          headers: {
            "X-LLM-API-Key": llmApiKey,
            "X-LLM-Base-Path": llmBasePath,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) {
        throw new Error(`ChatCompletions API error: ${response.status}`);
      }

      const data: { usage: Usage } = await response.json();

      // Calculate and charge for usage
      if (data.usage) {
        // TODO: Make it depend on LLM provided
        const cost = { completion: 1, prompt: 1 };

        const priceCreditUsd = calculateCost(data.usage, cost);
        const { charged } = await getSponsor(request, env, {
          charge: priceCreditUsd * 100,
          allowNegativeClv: true,
        });
        console.log("Charged successfully:", { cost, charged });
      } else {
        console.log("No usage data available");
      }

      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error: any) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  },
};

function calculateCost(
  usage: Usage,
  cost: { prompt: number; completion: number },
): number {
  return (
    (usage.prompt_tokens * cost.prompt) / 1_000_000 +
    (usage.completion_tokens * cost.completion) / 1_000_000
  );
}
