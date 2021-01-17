chrome.runtime.onInstalled.addListener(() => {
  //remove all rules on page change
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostEquals: 'meet.google.com',
              schemes: ['https'],
              // pathPrefix: '/',
            },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.clear();
});