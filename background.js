function getDomain(url) {
    try {
      return new URL(url).hostname;
    } catch (error) {
      console.error("Invalid URL:", url);
      return null;
    }
  }
  
async function organizeTabs() {
    try {
      const tabs = await chrome.tabs.query({});
      const domainGroups = {};
  
      
      tabs.forEach((tab) => {
        const domain = getDomain(tab.url);
        if (domain) {
          if (!domainGroups[domain]) {
            domainGroups[domain] = [];
          }
          domainGroups[domain].push(tab);
        }
      });
  
    
      for (const domain in domainGroups) {
        const domainTabs = domainGroups[domain];
        domainTabs.slice(1).forEach((tab) => chrome.tabs.remove(tab.id)); 
      }
    } catch (error) {
      console.error("Error organizing tabs:", error);
    }
  }
  
  async function activateFocusMode() {
    try {
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!activeTab) return;
  
      const activeDomain = getDomain(activeTab.url);
  
      const tabs = await chrome.tabs.query({ currentWindow: true });
      const unrelatedTabs = tabs.filter((tab) => getDomain(tab.url) !== activeDomain);
  
      if (unrelatedTabs.length > 0) {
        chrome.windows.create({ tabId: unrelatedTabs[0].id, state: "minimized" }, (newWindow) => {
          unrelatedTabs.slice(1).forEach((tab) => chrome.tabs.move(tab.id, { windowId: newWindow.id, index: -1 }));
        });
      }
    } catch (error) {
      console.error("Error activating focus mode:", error);
    }
  }
  
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'organize') {
      organizeTabs();
    } else if (message.action === 'focus') {
      activateFocusMode();
    }
  });
  