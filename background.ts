import { bookingCrawlerMediator } from "~lib/mediators/bookingCrawlerMediator"
import { travelorCrawlerMediator } from "~lib/mediators/travelorCrawlerMediator"

const onExtInstall = () => {
  chrome.tabs.create({
    active: true,
    url: chrome.runtime.getURL("tabs/index.html")
  })
}

const onExtIconClick = () => {
  chrome.action.onClicked.addListener(async (msg) => {
    chrome.tabs.create({
      active: true,
      url: chrome.runtime.getURL("tabs/index.html")
    })
  })
}

const cronJobs = () => {
  setInterval(() => {
    travelorCrawlerMediator.startAuthentication()
    bookingCrawlerMediator.startAuthentication()
  }, 3000)
}

async function boot() {
  // onExtInstall()
  onExtIconClick()
  cronJobs()
}

boot().catch((e) => {
  console.error(e)
})
