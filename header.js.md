window.data contains:

```
- sponsor?: {

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

}

- models:string[]
```

please create a header.js that fills div id 'header' with:

- if sponsor.is_authenticated:
  - render card with avatar and owner login and balance in $ (clv - spent, then divide by 100)
  - budget click goes to https://dashboard.uithub.com/usage
  - button to add balance to https://github.com/sponsors/janwilmake
  - button to logout (/logout)
- if not, button to /login

- render select box that allows select model. selecting sets it to localStorage 'model'. populates from there.
- button to github (github icon): https://github.com/janwilmake/uithub.chat

Be aware we have tailwind and color scheme is transition between purple and pink for the buttons. bg white, and height very small (50px, one line)

pls return a js codeblock for header.js vanilla js
