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
  const themecolors = useColors()
  return useEventCallback((label) => {
    if (!label) return themecolors.fg
    let hashNumber = 0
    for (let i = 0; i < label.length; i++) {
      hashNumber += label.charCodeAt(i)
    }
    return themecolors[colorsToCycle[hashNumber % colorsToCycle.length]]
  })
}
