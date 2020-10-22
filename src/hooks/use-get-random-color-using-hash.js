import useColors from "./use-colors"
import useEventCallback from "use-event-callback"

const colorsToCycle = [
  "red",
  "yellow",
  "orange",
  "magenta",
  "violet",
  "blue",
  "cyan",
  "green",
]

export default () => {
  const themeColors = useColors()
  return useEventCallback((label) => {
    if (!label) return colorsToCycle[0]
    let hashNumber = 0
    for (let i = 0; i < label.length; i++) {
      hashNumber += label.charCodeAt(i)
    }

    return colorsToCycle[hashNumber % colorsToCycle.length]
  })
}
