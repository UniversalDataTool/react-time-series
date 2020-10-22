import useColors from "./use-colors"
import useEventCallback from "use-event-callback"

const colorsToCycle = [
  "yellow",
  "orange",
  "red",
  "magenta",
  "violet",
  "blue",
  "cyan",
  "green",
]

export default () => {
  const themeColors = useColors()
  return useEventCallback((label) => {
    let hashNumber = 0
    for (let i = 0; i < label.length; i++) {
      hashNumber += label.charCodeAt(i)
    }

    return colorsToCycle[hashNumber % colorsToCycle.length]
  })
}
