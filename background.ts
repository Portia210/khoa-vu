const onExtInstall = () => {
  chrome.tabs.create({
    active: true,
    url: chrome.runtime.getURL('tabs/index.html'),
  });
}

const onExtIconClick = () => {
  chrome.tabs.create({
    active: true,
    url: chrome.runtime.getURL('tabs/index.html'),
  });
}

async function boot() {
  onExtInstall();
  onExtIconClick();
}

boot().catch((e) => {
  console.error(e);
});
