import moment from "moment"

export const formatTime = (time, format, visibleDuration) => {
  const lessThan3DaysShown = visibleDuration < 1000 * 60 * 60 * 24 * 3
  if (format === "none")
    return visibleDuration > 10
      ? Math.round(time).toString()
      : time.toFixed(2 - Math.log(visibleDuration) / Math.log(10))
  if (format === "dates") {
    return (
      moment(time).format("L") +
      (!lessThan3DaysShown ? "" : "\n" + moment(time).format("h:mm:ss a"))
    )
  }
  const showNs = visibleDuration < 5
  const showMs = visibleDuration < 5000
  const ns = Math.floor((time * 1000) % 1000)
  const ms = Math.floor(time % 1000)
  const secs = Math.floor((time / 1000) % 60)
  const mins = Math.floor((time / 60000) % 60)
  const hours = Math.floor(time / (60000 * 60))
  if (time < 0) return "< 00:00:00"
  return (
    [hours, mins, secs].map((t) => t.toString().padStart(2, "0")).join(":") +
    (showMs ? `.${ms.toString().padStart(3, "0")}` : "") +
    (showNs ? `\n+${ns.toString()} ns` : "")
  )
}
export default formatTime
