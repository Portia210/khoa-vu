import cssText from "data-text:~style.css"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export default function CrawlerWrapperComponent({ children }: any) {
  return <>{children}</>
}
