// This file is intentionally left blank.

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({
    // 指向构建后的 index.html
    url: chrome.runtime.getURL('index.html')
  });
});
