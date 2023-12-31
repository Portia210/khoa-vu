export type TabType = {
  url?: string | undefined;
  id?: number | undefined;
};

type OptionsType = {
  active: boolean;
  url: string;
};

export async function createTab(options: OptionsType): Promise<TabType> {
  const tabData: TabType = await chrome.tabs.create(options);
  return tabData;
}

export async function findByUrl(url: string): Promise<TabType[]> {
  const tabs: TabType[] = await chrome.tabs.query({ url });
  return tabs;
}

export const closeTab = async (url: string): Promise<void> => {
  const tabs = await findByUrl(url);

  for (const tab of tabs) {
    chrome.tabs.remove(tab?.id as number);
  }
};

export const closeTabById = async (tabId: number): Promise<void> => {
  chrome.tabs.remove(tabId);
};

export const createWindow = async (url: string): Promise<number | undefined> => {
  const window = await chrome.windows.create({ url, focused: false, state: 'minimized' });

  return window.id;
};

export const closeWindow = async (windowId: number | undefined): Promise<void> => {
  if (windowId) {
    await chrome.windows.remove(windowId);
  }
};

export async function fuzzySearchTabs(searchStr: string): Promise<chrome.tabs.Tab[]> {
  return new Promise((res) => {
    chrome.tabs.query({}, (tabs) => {
      const matchingTabs = tabs.filter((tab) => {
        return tab.url && tab.url.includes(searchStr);
      });
      res(matchingTabs);
    });
  });
}

export async function regexSearchTabs(regex: RegExp): Promise<chrome.tabs.Tab[]> {
  return new Promise((res) => {
    chrome.tabs.query({}, (tabs) => {
      const matchingTabs = tabs.filter((tab) => {
        return tab.url && tab.url.match(regex);
      });
      res(matchingTabs);
    });
  });
}
