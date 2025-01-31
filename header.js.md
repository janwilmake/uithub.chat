window.data contains:

```ts
type Data = {
  sponsor?: {
    /** whether or not the sponsor has ever authenticated anywhere */
    is_authenticated?: boolean;
    /** url where the user first authenticated */
    source?: string;
    /** node id of the user */
    owner_id: string;
    /** github username */
    owner_login: string;
    /** github avatar url */
    avatar_url?: string;
    /** true if the user has ever sponsored */
    is_sponsor?: boolean;
    /** total money the user has paid, in cents */
    clv?: number;
    /** total money spent on behalf of the user (if tracked), in cents */
    spent?: number;
    /** balance (in usd) */
    balance?: string;
  };

  models: {
    provider: string;
    description: string;
    models: {
      id: string;
      promptCpm: number;
      completionCpm: number;
    }[];
  }[];
};
```

Please create a header.js that fills div id 'header' with:

- if sponsor.is_authenticated:
  - render card with avatar and owner login and balance
  - budget click goes to https://dashboard.uithub.com/usage
  - button to add balance to https://github.com/sponsors/janwilmake
  - button to logout (/logout)
- if not, button to /login

- Render select box that allows select model

  - grouped by provider (title provider + description)
  - item titles are (`id - $promptCpm / $completionCpm`)
  - set localStorage:`model` to first model of first provider if it wasn't set yet
  - selecting sets it to localStorage 'model'. populates from there.
  - Models costing >1 completionCpm are disabled if your balance is <0.

- Setting to alter system prompt. opens config panel that manages localStorage systemPrompts:{title,prompt}[] and currentSystemPrompt:string for the selected one

- button to github (github icon): https://github.com/janwilmake/uithub.chat

Be aware we have tailwind and color scheme is transition between purple and pink (thinlined for buttons). bg white, and height very small (50px, one line)

Pls return a js codeblock for header.js vanilla js
