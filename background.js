chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  suggest([
    { content: text, description: `Ask Gemini: ${text}` }
  ]);
});

chrome.omnibox.onInputEntered.addListener((text) => {
  chrome.storage.local.set({ pendingQuery: text }, () => {
    chrome.tabs.create({ url: "https://gemini.google.com/app" });
  });
});
