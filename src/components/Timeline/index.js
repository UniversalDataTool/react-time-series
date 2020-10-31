import React from "react"
import range from "lodash/range"
import { styled } from "@material-ui/core/styles"
import useColors from "../../hooks/use-colors"
import TimeStamp from "../TimeStamp"

import { formatTime } from "../../utils/format-time"

const Container = styled("div")(({ width, themeColors }) => ({
  width,
  overflow: "hidden",
  position: "relative",
  height: 64,
  borderBottom: `1px solid ${themeColors.Selection}`,
  color: themeColors.fg,
}))

const TimeText = styled("div")(({ x, faded }) => ({
  display: "inline-block",
  width: 80,
  fontSize: 12,
  fontVariantNumeric: "tabular-nums",
  position: "absolute",
  left: x,
  borderLeft: "1px solid rgba(255,255,255,0.5)",
  paddingLeft: 4,
  whiteSpace: "wrap",
  opacity: faded ? 0.5 : 1,
}))

const Svg = styled("svg")({
  position: "absolute",
  left: 0,
  bottom: 0,
})

export const Timeline = ({
  timeFormat,
  visibleTimeStart,
  visibleTimeEnd,
  width,
  timestamps = [],
  gridLineMetrics,
  onClickTimestamp,
  onRemoveTimestamp,
}) => {
  const themeColors = useColors()
  const visibleDuration = visibleTimeEnd - visibleTimeStart
  // TODO compute tick count using width
  const timeTextCount = Math.ceil(width / 100)
  const timeTextTimes = range(timeTextCount).map(
    (i) => visibleTimeStart + (visibleDuration / timeTextCount) * i
  )

  const {
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
          faded={timeTextTimes[timeTextIndex] < 0}
        >
          {formatTime(
            timeTextTimes[timeTextIndex],
            timeFormat,
            visibleDuration
          )}
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
              stroke={themeColors.base01}
            />
          )
        })}
      </Svg>
      {timestamps.map((timestamp, i) => {
        const left =
          ((timestamp.time - visibleTimeStart) / visibleDuration) * width
        return (
          <TimeStamp
            key={i}
            left={left}
            {...timestamp}
            onClick={() => onClickTimestamp(timestamp, i)}
            onRemove={() => onRemoveTimestamp(timestamp, i)}
          />
        )
      })}
    </Container>
  )
}

export default Timeline
