import React from "react"
import range from "lodash/range"
import { styled } from "@material-ui/core/styles"

const Container = styled("div")(({ width }) => ({
  width,
  position: "relative",
  height: 32,
  borderBottom: "1px solid #888",
}))

const TimeText = styled("div")(({ x }) => ({
  display: "inline-block",
  width: 80,
  position: "absolute",
  left: x,
}))

const Tick = styled("div")(({ x, big }) => ({
  position: "absolute",
  left: x,
  bottom: 0,
  width: 1,
  height: 8 + (big ? 4 : 0),
  backgroundColor: "#333",
}))

const formatTime = (time, format) => {
  if (format === "none") return time
  if (time < 0) return ""
  const deciSecs = Math.floor((time % 1000) / 10)
  const secs = Math.floor((time / 1000) % 60)
  const mins = Math.floor((time / 60000) % 60)
  const hours = Math.floor(time / (60000 * 60))
  return [hours, mins, secs, deciSecs]
    .map((t) => t.toString().padStart(2, "0"))
    .join(":")
}

export const TimelineTimes = ({
  timeFormat,
  visibleTimeStart,
  visibleTimeEnd,
  width,
}) => {
  const visibleDuration = visibleTimeEnd - visibleTimeStart
  // TODO compute tick count using width
  const timeTextCount = Math.ceil(width / 100)
  const timeTextTimes = range(timeTextCount).map(
    (i) => visibleTimeStart + (visibleDuration / timeTextCount) * i
  )

  const tickCount = Math.ceil(width / 20)

  return (
    <Container width={width}>
      {range(timeTextCount).map((timeTextIndex) => (
        <TimeText x={(timeTextIndex / timeTextCount) * width}>
          {formatTime(timeTextTimes[timeTextIndex], timeFormat)}
        </TimeText>
      ))}
      {range(tickCount).map((tickIndex) => (
        <Tick big={tickIndex % 5 === 0} x={(tickIndex / tickCount) * width} />
      ))}
    </Container>
  )
}

export default TimelineTimes
