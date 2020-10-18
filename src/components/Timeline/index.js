import React from "react"
import range from "lodash/range"
import { styled } from "@material-ui/core/styles"
import moment from "moment"
import useColors from "../../hooks/use-colors"
import TimeStamp from "../TimeStamp"

const Container = styled("div")(({ width, themeColors }) => ({
  width,
  overflow: "hidden",
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

const Svg = styled("svg")({
  position: "absolute",
  left: 0,
  bottom: 0,
})

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

export const Timeline = ({
  timeFormat,
  visibleTimeStart,
  visibleTimeEnd,
  width,
  timestamps = [],
  gridLineMetrics,
}) => {
  const themeColors = useColors()
  const visibleDuration = visibleTimeEnd - visibleTimeStart
  // TODO compute tick count using width
  const timeTextCount = Math.ceil(width / 100)
  const timeTextTimes = range(timeTextCount).map(
    (i) => visibleTimeStart + (visibleDuration / timeTextCount) * i
  )

  const {
    // numberOfMinorGridLines,
    // minorGridLinePixelOffset,
    // minorGridLinePixelDistance,
    numberOfMajorGridLines,
    majorGridLinePixelOffset,
    majorGridLinePixelDistance,
  } = gridLineMetrics

  return (
    <Container themeColors={themeColors} width={width}>
      {range(timeTextCount).map((timeTextIndex) => (
        <TimeText
          key={timeTextIndex}
          x={(timeTextIndex / timeTextCount) * width}
        >
          {formatTime(timeTextTimes[timeTextIndex], timeFormat)}
        </TimeText>
      ))}
      <Svg width={width} height={12}>
        {range(numberOfMajorGridLines).map((tickIndex) => {
          const x =
            majorGridLinePixelOffset + majorGridLinePixelDistance * tickIndex
          return (
            <line
              key={tickIndex}
              x1={x}
              x2={x}
              y1={0}
              y2={12}
              stroke={themeColors["Current Line"]}
            />
          )
        })}
      </Svg>
      {timestamps.map((timestamp, i) => {
        const left =
          ((timestamp.time - visibleTimeStart) / visibleDuration) * width
        return <TimeStamp key={i} left={left} {...timestamp} />
      })}
    </Container>
  )
}

export default Timeline
