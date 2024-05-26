// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveSeedPhrase") {
      chrome.storage.local.set({ seedPhrase: request.seedPhrase }, () => {
        sendResponse({ status: "success" });
      });
    } else if (request.action === "loadSeedPhrase") {
      chrome.storage.local.get("seedPhrase", (result) => {
        sendResponse({ seedPhrase: result.seedPhrase });
      });
    }
    return true; // Required to indicate that the response will be sent asynchronously
  });
  