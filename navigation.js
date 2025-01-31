// Helper functions
const getContexts = () => JSON.parse(localStorage.getItem("context") || "[]");
const setContexts = (contexts) =>
  localStorage.getItem("context", JSON.stringify(contexts));
const getCollapsed = () =>
  JSON.parse(localStorage.getItem("collapsed") || "[]");
const setCollapsed = (collapsed) =>
  localStorage.setItem("collapsed", JSON.stringify(collapsed));

// Group contexts by domain and path
function groupContexts(contexts) {
  const groups = {};
  contexts
    .sort((a, b) => a.url.localeCompare(b.url))
    .forEach((context) => {
      const url = new URL(context.url);
      const domain = url.hostname;
      const path = url.pathname
        .split("/")
        .filter((p) => p)
        .join("/");

      if (!groups[domain]) groups[domain] = {};
      if (!groups[domain][path]) groups[domain][path] = [];
      groups[domain][path].push(context);
    });
  return groups;
}

// Create navigation HTML
function renderNavigation() {
  const contexts = getContexts();
  const groups = groupContexts(contexts);
  const collapsed = getCollapsed();
  const currentContext = localStorage.getItem("currentContext");
  let html = "";

  Object.entries(groups).forEach(([domain, paths]) => {
    const isDomainCollapsed = collapsed.includes(domain);
    html += `
            <div class="mb-2">
                <div class="flex items-center p-2 bg-gray-100 rounded cursor-pointer" 
                     onclick="toggleCollapse('${domain}')">
                    <span class="transform ${
                      isDomainCollapsed ? "" : "rotate-90"
                    } transition-transform">▶</span>
                    <span class="ml-2 font-bold truncate max-w-[200px]">${domain}</span>
                    <button onclick="deleteSection('${domain}')" 
                            class="ml-auto text-red-500 hover:text-red-700">🗑️</button>
                </div>
                <div class="${isDomainCollapsed ? "hidden" : ""}">`;

    Object.entries(paths).forEach(([path, items]) => {
      const pathKey = `${domain}/${path}`;
      const isPathCollapsed = collapsed.includes(pathKey);
      html += `
                <div class="ml-4 mt-1">
                    <div class="flex items-center p-1 cursor-pointer" 
                         onclick="toggleCollapse('${pathKey}')">
                        <span class="transform ${
                          isPathCollapsed ? "" : "rotate-90"
                        } transition-transform">▶</span>
                        <span class="ml-2 truncate max-w-[200px]">${
                          path || "/"
                        }</span>
                    </div>
                    <div class="${isPathCollapsed ? "hidden" : ""}">`;

      items.forEach((item) => {
        const isSelected = item.key === currentContext;
        html += `
                    <div class="ml-6 p-1 flex items-center ${
                      isSelected ? "bg-blue-100 rounded" : ""
                    }" 
                         onclick="selectContext('${item.key}')"
                         title="${item.description || ""}">
                        <span class="flex-1 truncate max-w-[200px]">${
                          item.title || item.url
                        }</span>
                        ${
                          item.tokens
                            ? `<span class="text-sm text-gray-500">${item.tokens}</span>`
                            : ""
                        }
                        <button onclick="deleteContext('${item.key}')" 
                                class="ml-2 text-red-500 hover:text-red-700">🗑️</button>
                    </div>`;
      });

      html += `</div></div>`;
    });

    html += `</div></div>`;
  });

  document.getElementById("navigation").innerHTML = html;
}

// Toggle collapse state
function toggleCollapse(prefix) {
  const collapsed = getCollapsed();
  const index = collapsed.indexOf(prefix);
  if (index === -1) {
    collapsed.push(prefix);
  } else {
    collapsed.splice(index, 1);
  }
  setCollapsed(collapsed);
  renderNavigation();
}

// Delete section
function deleteSection(domain) {
  event.stopPropagation();
  if (!confirm(`Delete all contexts for ${domain}?`)) return;

  const contexts = getContexts().filter((context) => {
    const url = new URL(context.url);
    return url.hostname !== domain;
  });
  localStorage.setItem("context", JSON.stringify(contexts));
  renderNavigation();
}

// Delete individual context
function deleteContext(key) {
  event.stopPropagation();
  const contexts = getContexts().filter((context) => context.key !== key);
  localStorage.setItem("context", JSON.stringify(contexts));
  if (localStorage.getItem("currentContext") === key) {
    localStorage.removeItem("currentContext");
    document.getElementById("contextContent").value = "";
  }
  renderNavigation();
}

// Select and load context
async function selectContext(key) {
  const context = getContexts().find((c) => c.key === key);
  if (!context) return;

  try {
    localStorage.setItem("currentContext", key);
    renderNavigation();

    const response = await fetch(context.url);
    const text = await response.text();
    document.getElementById("contextContent").value = text;

    const messagesContainer = document.getElementById("messages");
    messagesContainer.replaceChildren();

    document.getElementById("tokenCount").textContent = `(${Math.round(
      text.length / 5,
    )})`;

    // Update tokens
    context.tokens = Math.round(text.length / 5);
    localStorage.setItem(
      "context",
      JSON.stringify(getContexts().map((c) => (c.key === key ? context : c))),
    );
  } catch (error) {
    alert(`Error loading context: ${error.message}`);
  }
}

// Add new context
function addContext() {
  const url = prompt("Enter URL:");
  if (!url) return;
  window.location.href = `?context=${encodeURIComponent(url)}`;
}

// Handle URL context parameter
async function handleContextParam() {
  const params = new URLSearchParams(window.location.search);
  const contextUrl = params.get("context");
  if (!contextUrl) return;

  try {
    const response = await fetch(contextUrl);
    const text = await response.text();
    let contexts = getContexts();

    try {
      const json = JSON.parse(text);
      if (json.context) {
        // For each new context, either add it or update existing
        json.context.forEach((newContext) => {
          const existingIndex = contexts.findIndex(
            (c) => c.key === newContext.key,
          );
          if (existingIndex >= 0) {
            contexts[existingIndex] = newContext;
          } else {
            contexts.push(newContext);
          }
        });
      } else {
        const newContext = {
          key: contextUrl,
          url: contextUrl,
          title: new URL(contextUrl).pathname,
          tokens: Math.round(text.length / 5),
        };
        const existingIndex = contexts.findIndex(
          (c) => c.key === newContext.key,
        );
        if (existingIndex >= 0) {
          contexts[existingIndex] = newContext;
        } else {
          contexts.push(newContext);
        }
      }
    } catch {
      const newContext = {
        key: contextUrl,
        url: contextUrl,
        title: new URL(contextUrl).pathname,
        tokens: Math.round(text.length / 5),
      };
      const existingIndex = contexts.findIndex((c) => c.key === newContext.key);
      if (existingIndex >= 0) {
        contexts[existingIndex] = newContext;
      } else {
        contexts.push(newContext);
      }
    }

    localStorage.setItem("context", JSON.stringify(contexts));
    localStorage.setItem("currentContext", contexts[contexts.length - 1].key);
    window.location.href = window.location.pathname;
  } catch (error) {
    alert(`Error adding context: ${error.message}`);
  }
}

// Initialize
handleContextParam();
renderNavigation();
const currentContext = localStorage.getItem("currentContext");
if (currentContext) {
  selectContext(currentContext);
}
