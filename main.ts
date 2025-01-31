export default {
  fetch: async (request: Request) => {
    // TODO:
    // 1. sponsorflare login
    // 2. paid wrapper around chatcompletions POST /chat/completions with predefined apis and cost structure
    return new Response("Unavailable", { status: 400 });
  },
};
