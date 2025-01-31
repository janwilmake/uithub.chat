Create a html with tailwindcss script with a navigation on the left and context interface on the right (75%):

left: navigation:

- navigation (populated from localStorage `context` of shape {key, title, url, description, tokens:number}[]
- sorted on URL
- collabsible and expandable on domain and path (stored in localstorage:collapsed: urlPrefix[])
- currentContext:string holds a key of a context
- currentContext is highlighted in navigation
- title + tokens (if available) is shown, description tooltip on hover
- ability to delete an entire collapsible section, or individual context using a bin icon click
- new context gets added to localStorage (overwriting if duplicate keys) when ?context= is available. it then fetches that.
  - if it's JSON, it first looks if context key is available and uses that as new items
  - if it's not json or that's not available, inserts the context as url directly (?context becomes context {key:url, url, tokesns:result.length/5})
  - after adding, selects the first one of that newly added as `currentContext`
- when clicked a context, loads the url and updates tokens in context based on result, and shows context in right pane
- up top, button 'add context' which opens a prompt for a URL which navigates to ?context=URL so it's added
- ensure the titles and items show up with ellipsis if length>30
- ensure it doesn't add a context that was already there, if so, ensure to overwrite old one

right pane:

- Shows text area full width/height with the selected context. if no currentContext is selected, show 'please select a context'

Create the part that does everything for the navigation and return a js codeblock so i can inmport that into the html
