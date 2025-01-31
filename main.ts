import { Env as SponsorflareEnv, getSponsor, middleware } from "sponsorflare";
import indexHtml from "./index.html";

interface Env extends SponsorflareEnv {}

interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

const COST_PER_MILLION_TOKENS = 1;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
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
      const requestBody = await request.json();

      // Forward the request to chatcompletions.com
      const response = await fetch(
        "https://chatcompletions.com/chat/completions",
        {
          method: "POST",
          headers: {
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
        const cost = calculateCost(data.usage);
        const { charged } = await getSponsor(request, env, {
          charge: cost * 100,
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

function calculateCost(usage: Usage): number {
  return (usage.total_tokens * COST_PER_MILLION_TOKENS) / 1_000_000;
}
