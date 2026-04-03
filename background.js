chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "discardTab",
    title: "Pause Tab (Free Memory)",
    contexts: ["page"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "discardTab" && tab?.id) {
    chrome.tabs.discard(tab.id);
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "discardTab") {
    chrome.tabs.discard(msg.tabId, () => {
      sendResponse({ success: !chrome.runtime.lastError });
    });
    return true;
  }

  if(msg.action === "discardAllInactive"){
    chrome.tabs.query({ active: false, discarded: false }, (tabs) => {
      tabs.forEach(tab => chrome.tabs.discard(tab.id));
      sendResponse({ count: tabs.length });
    });
    return true;
  }
});