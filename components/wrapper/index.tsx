import cssText from "data-text:~style.css"
import { useEffect } from "react"

import { CronJobs } from "~service/cronJobs"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export default function CrawlerWrapperComponent({ children }: any) {
  useEffect(() => {
    CronJobs.fetchJobs()
  }, [])
  return <>{children}</>
}
