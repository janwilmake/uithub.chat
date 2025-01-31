// tabs.js
document.addEventListener("DOMContentLoaded", () => {
  class TabsManager {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      this.tabs = [];
      this.activeTab = null;
      this.init();
    }

    init() {
      // Find all tab buttons and content
      this.tabButtons = this.container.querySelectorAll("[data-tab]");
      this.tabContents = this.container.querySelectorAll(".tab-content");

      // Initialize tabs
      this.tabButtons.forEach((button) => {
        const tabId = button.dataset.tab;
        const content = document.getElementById(tabId);

        if (content) {
          this.tabs.push({
            button,
            content,
            id: tabId,
          });
        }
      });

      // Set initial active tab
      const storedTab = localStorage.getItem("activeTab");
      const initialTab = storedTab || this.tabs[0]?.id;
      this.switchTab(initialTab);

      // Add event listeners
      this.tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
          this.switchTab(button.dataset.tab);
        });
      });
    }

    switchTab(tabId) {
      const newTab = this.tabs.find((t) => t.id === tabId);
      if (!newTab || this.activeTab === newTab) return;

      // Deactivate current tab
      if (this.activeTab) {
        this.activeTab.button.classList.remove("active");
        this.activeTab.content.classList.add("hidden");
      }

      // Activate new tab
      newTab.button.classList.add("active");
      newTab.content.classList.remove("hidden");
      this.activeTab = newTab;

      // Store state
      localStorage.setItem("activeTab", tabId);
    }
  }

  // Initialize tabs system
  window.tabsManager = new TabsManager("tabs");
});
