# Initial version (January 31, 2025)

- ✅ Make sponsorflare + chatcompletions wrapped backend work (allow $1 free) - start from sponsorflare.chat
- ✅ Add logged user profile to header (header.js) that also shows setting to change LLM
- Fix chatcompletions.com error and ensure chatting works
- Add other model names and api keys (openai, anthropic)
- Render markdown, codeblock color highlighting, copy codeblocks, copy responses
- Render `<think>` and any other raw tag, not in codeblock, as expandible things

# Tiny improvements

- Setting to alter system prompt stored in config panel.
- Create system prompt to output with `<content path="">some code or 'null' to delete</content>` etc similar to what i had for filetransformers, but using xml
- add outlink for selected context in headerbar (icon)
- Ensure loading only shows up for new message, not temporarily removing all chat history
- Allow copying context to clipboard
- Show token size at menu tab
- Hide bin icon until hover, align at the right of the menu item, change to 'x'
- Make header buttons more subtle
- When clicking a menu item, focus on chat input
- Chat input must be textarea
- Context retrieval should go via proxy to avoid error. Should return urls for screenshot/content/html for html urls.
- If added context is of type html, allow choosing screenshot/content/html and set context-item appropriately.
- Allow darkmode by simply inverting all colors
- Add status via status API for providers
- Make expensive models only available after sponsor
- Put model selection as part of chat

🔥 Add githuw (context-driven LLM chat) to forgithub and uithub.cf header

🔥 Now fix patching and allow patching from response with `<code>`
