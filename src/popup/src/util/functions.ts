import 'chrome-extension-async';
export const getActiveTabId = async (): Promise<number> => {
  const tabs = await chrome.tabs.query({active: true, currentWindow: true});
  if (!tabs) throw new Error('invalid active tab');
  if (!tabs[0].id) throw new Error('active tab id not found');
  return tabs[0].id;
};

export const getActiveTabUrl = async (): Promise<string> => {
  const tabs = await chrome.tabs.query({active: true, currentWindow: true});
  if (!tabs) throw new Error('invalid active tab');
  console.log(tabs);
  if (!tabs[0].url) throw new Error('active tab url not found');
  return tabs[0].url;
};


export const randInt = (min: number, max: number): number => {
  return Math.floor(Math.random()*(max-min)+min);
};

export const randNum = (min: number, max: number): number => {
  return Math.random()*(max-min)+min;
};