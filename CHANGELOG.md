# Initial version (January 31, 2025)

- ✅ Make sponsorflare + chatcompletions wrapped backend work (allow $1 free) - start from sponsorflare.chat
- ✅ Add logged user profile to header (header.js) that also shows setting to change LLM
- ✅ Fix local login `/callback`
- Fix chatcompletions.com error and ensure chatting works
- ✅ Add other model names and api keys (openai, anthropic)

✅ Tabs;

- Button for copying context to clipboard
- Show token count at menu tab (reads textarea value length / 5)

✅ Chat

- Ensure loading shows at the location where the new message will be
- Render markdown in response
- Codeblock color highlighting
- Buttons to copy responses
- Chat input must be textarea
- Allow darkmode by simply inverting all colors
- Render `<think>` and any other raw tag, not in codeblock, as expandible things

# Tiny improvements

Header

- Add outlink that navigates to the URL of the selected context in headerbar (icon)

Nav

- Hide bin icon until hover, align at the right of the menu item, change to 'x'
- When clicking a menu item, focus on chat input
- Context retrieval should go via proxy to avoid error. Should return urls for screenshot/content/html for html urls.
- If added context is of type html, allow choosing screenshot/content/html and set context-item appropriately.

Misc

- Add status via status API for providers

🔥 Add githuw (context-driven LLM chat) to forgithub and uithub.cf header

🔥 Now fix patching and allow patching from response with `<code>`
