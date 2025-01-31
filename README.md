# Uithub Chat - Context-driven LLM-chat for Devs

Goals:

- ✓ Smooth onboarding, freemium monetised
- Easily switch context from any URL
- Super easy to integrate with any context by adding JSON URL (can even be dynamic)
- Ability to easily filter on file objects

Non-goals:

- Super beautiful UI, animations, streaming, etc (functionality first)
- Message editing, history saving (focus on core features)
- Allow BYOK (optimise for accessibility)

Wishlist:

- **Status**: Add status via status API for providers
- **Droparea**: create droparea that lights up purple dotted so you can drag and drop URLs
- **Sharing result**: Use x-output-url from chatcompletions.com to allow sharing of the response (add outlink besides copy). Maybe can also use URL as prompt instead, and allow `?chat=chatcompletionsURL` to load it into the chat. This way, people can save their chat history!
- **File upload**: Allow uploading files by dragging them (uploads with multipart into a zip, making it a secret zipobject url).
- Fix patching and allow patching from response with `<code>`

## TODO

- Header: Add outlink that navigates to the URL of the selected context in headerbar (icon)
- Chat: Render `<think>` and any other raw tag in a way that it's indented and other color/bg-color.

Nav

- Hide bin icon until hover, align at the right of the menu item, change to 'x'
- When clicking a menu item, focus on chat input, if visible
- Context retrieval should go via proxy to avoid error. Should return urls for screenshot/content/html for html urls.
- If added context is of type html, allow choosing screenshot/content/html and set context-item appropriately.
