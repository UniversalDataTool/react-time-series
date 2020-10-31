import moment from "moment"

export const formatTime = (time, format, visibleDuration) => {
  const lessThan3DaysShown = visibleDuration < 1000 * 60 * 60 * 24 * 3
  if (format === "none")
    return visibleDuration > 10
      ? Math.round(time)
      : time.toFixed(2 - Math.log(visibleDuration) / Math.log(10))
  if (format === "dates") {
    return (
      moment(time).format("L") +
      (!lessThan3DaysShown ? "" : "\n" + moment(time).format("h:mm:ss a"))
    )
  }
  if (time < 0) return "< 00:00:00"
  const deciSecs = Math.floor((time % 1000) / 10)
  const secs = Math.floor((time / 1000) % 60)
  const mins = Math.floor((time / 60000) % 60)
  const hours = Math.floor(time / (60000 * 60))
  return [hours, mins, secs, deciSecs]
    .map((t) => t.toString().padStart(2, "0"))
    .join(":")
}
export default formatTime
