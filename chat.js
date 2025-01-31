document.addEventListener("DOMContentLoaded", () => {
  const messagesContainer = document.getElementById("messages");
  const messageInput = document.getElementById("messageInput");
  const contextContent = document.getElementById("contextContent");

  // Scroll handling
  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Copy button handling
  function copyMessageContent(button) {
    const content =
      button.parentElement.querySelector(".message-content").textContent;
    navigator.clipboard.writeText(content);

    const originalHTML = button.innerHTML;
    button.innerHTML = "Copied!";
    button.classList.add("text-purple-500");

    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.classList.remove("text-purple-500");
    }, 1000);
  }

  // Message creation
  function createMessageElement(role, content) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `mb-2 p-2 rounded relative ${
      role === "user" ? "ml-auto w-4/5" : "mr-8"
    }`;

    const processedContent = content.replace(
      /<think>(.*?)<\/think>/gs,
      (_, p1) =>
        `<div class="think-container" onclick="this.querySelector('.think-content').classList.toggle('hidden')">
                    <div class="think-content">${marked.parse(p1)}</div>
                    <div class="text-gray-500 text-sm">Click to expand thinking...</div>
                </div>`,
    );

    messageDiv.innerHTML = `
            <div class="message-content ${
              role === "user" ? "bg-purple-100" : "bg-gray-100"
            } p-3 rounded">
                ${marked.parse(processedContent)}
            </div>
            <button onclick="copyMessageContent(this)" 
                    class="copy-btn bg-white hover:text-purple-500 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
            </button>
        `;

    return messageDiv;
  }

  // Message handling
  window.appendMessage = function (role, content) {
    const messageElement = createMessageElement(role, content);
    messagesContainer.appendChild(messageElement);
    scrollToBottom();
    hljs.highlightAll();
  };

  // Message sending
  window.sendMessage = async function () {
    const message = messageInput.value.trim();
    if (!message) return;

    appendMessage("user", message);
    messageInput.value = "";

    const loadingDiv = document.createElement("div");
    loadingDiv.className = "mb-2 p-2 rounded bg-gray-100 mr-8";
    loadingDiv.innerHTML = `
            <div class="flex items-center space-x-2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                <span class="text-gray-600">Processing...</span>
            </div>
        `;
    messagesContainer.appendChild(loadingDiv);
    scrollToBottom();

    try {
      const response = await fetch("/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: localStorage.getItem("model"),
          messages: [
            { role: "system", content: contextContent.value },
            { role: "user", content: message },
          ],
        }),
      });

      if (response.status === 401) {
        localStorage.setItem("lastMessage", message);
        window.location.href = "/login";
        return;
      }

      if (response.status === 402) {
        appendMessage("system", "Payment required - please add balance");
        return;
      }

      const data = await response.json();
      messagesContainer.removeChild(loadingDiv);
      appendMessage("assistant", data.choices[0].message.content);
    } catch (error) {
      console.error("Error:", error);
      appendMessage("system", "Error sending message");
    }
  };

  // Input handling
  window.handleTextareaKey = function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  // Initialize
  messagesContainer.classList.add("h-[calc(100vh-220px)]", "overflow-y-auto");
  window.copyMessageContent = copyMessageContent;
});
