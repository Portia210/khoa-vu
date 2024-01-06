import cssText from "data-text:~style.css"
import { useEffect, useState } from "react"

import { CronJobs } from "~service/cronJobs"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export default function CrawlerWrapperComponent({ children }: any) {
  const [cronJobs, setCronJobs] = useState<NodeJS.Timeout>()
  useEffect(() => {
    if (cronJobs) clearInterval(cronJobs)
    CronJobs.fetchJobs().then((cronJobs) => {
      setCronJobs(cronJobs)
    })
    return () => {
      clearInterval(cronJobs) 
    }
  }, [])
  return <>{children}</>
}
