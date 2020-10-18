import React from "react"
import range from "lodash/range"
import { styled } from "@material-ui/core/styles"
import moment from "moment"
import useColors from "../../hooks/use-colors"
import TimeStamp from "../TimeStamp"

const Container = styled("div")(({ width, themeColors }) => ({
  width,
  position: "relative",
  height: 48,
  borderBottom: `1px solid ${themeColors.Selection}`,
  color: themeColors.fg,
}))

const TimeText = styled("div")(({ x }) => ({
  display: "inline-block",
  width: 80,
  fontSize: 12,
  fontVariantNumeric: "tabular-nums",
  position: "absolute",
  left: x,
}))

const Tick = styled("div")(({ x, big, themeColors }) => ({
  position: "absolute",
  left: x,
  bottom: 0,
  width: 1,
  height: 8 + (big ? 4 : 0),
  backgroundColor: themeColors["Current Line"],
}))

export const formatTime = (time, format) => {
  if (format === "none") return time
  if (format === "dates") {
    return moment(time).format("L")
  }
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
  timestamps = [],
}) => {
  const themeColors = useColors()
  const visibleDuration = visibleTimeEnd - visibleTimeStart
  // TODO compute tick count using width
  const timeTextCount = Math.ceil(width / 100)
  const timeTextTimes = range(timeTextCount).map(
    (i) => visibleTimeStart + (visibleDuration / timeTextCount) * i
  )

  const tickCount = Math.ceil(width / 20)

  return (
    <Container themeColors={themeColors} width={width}>
      {range(timeTextCount).map((timeTextIndex) => (
        <TimeText x={(timeTextIndex / timeTextCount) * width}>
          {formatTime(timeTextTimes[timeTextIndex], timeFormat)}
        </TimeText>
      ))}
      {range(tickCount).map((tickIndex) => (
        <Tick
          big={tickIndex % 5 === 0}
          x={(tickIndex / tickCount) * width}
          themeColors={themeColors}
        />
      ))}
      {timestamps.map((timestamp, i) => {
        const left =
          ((timestamp.time - visibleTimeStart) / visibleDuration) * width
        return <TimeStamp key={i} left={left} {...timestamp} />
      })}
    </Container>
  )
}

export default TimelineTimes
