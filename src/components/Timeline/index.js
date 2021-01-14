import React, { useRef } from "react"
import range from "lodash/range"
import { styled } from "@material-ui/core/styles"
import useColors from "../../hooks/use-colors"
import TimeStamp from "../TimeStamp"
import {
  useTimeCursorTime,
  useSetTimeCursorTime,
} from "../../hooks/use-time-cursor-time"
import useRootAudioElm from "../../hooks/use-root-audio-elm"
import useEventCallback from "use-event-callback"

import { formatTime } from "../../utils/format-time"

const Container = styled("div")(({ width, themecolors }) => ({
  width,
  overflow: "hidden",
  position: "relative",
  height: 64,
  cursor: "pointer",
  borderBottom: `1px solid ${themecolors.Selection}`,
  color: themecolors.fg,
}))

const TimeText = styled("div")(({ x, faded }) => ({
  display: "inline-block",
  width: 80,
  fontSize: 12,
  fontVariantNumeric: "tabular-nums",
  position: "absolute",
  top: 16,
  left: x,
  borderLeft: "1px solid rgba(255,255,255,0.5)",
  paddingLeft: 4,
  whiteSpace: "pre-wrap",
  opacity: faded ? 0.25 : 0.75,
}))

const TimeCursor = styled("div")(({ left, themecolors }) => ({
  position: "absolute",
  width: 0,
  height: 0,
  top: 0,
  left: left - 6,
  borderLeft: "8px solid transparent",
  borderRight: "8px solid transparent",
  borderTop: `12px solid ${themecolors.green}`,
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
  timeCursorTime: timeCursorTimeProp,
}) => {
  const themecolors = useColors()
  const visibleDuration = visibleTimeEnd - visibleTimeStart
  // TODO compute tick count using width
  const timeTextCount = Math.ceil(width / 100)
  const timeTextTimes = range(timeTextCount).map(
    (i) => visibleTimeStart + (visibleDuration / timeTextCount) * i
  )
  const recoilTimeCursorTime = useTimeCursorTime()
  const setTimeCursorTime = useSetTimeCursorTime()
  const [rootAudioElm] = useRootAudioElm()
  const timeCursorTime =
    timeCursorTimeProp === undefined ? recoilTimeCursorTime : timeCursorTimeProp

  const {
    numberOfMajorGridLines,
    majorGridLinePixelOffset,
    majorGridLinePixelDistance,
  } = gridLineMetrics

  const containerRef = useRef()

  const onClickTimeline = useEventCallback((e) => {
    if (!rootAudioElm) return
    const { clientX } = e
    const pxDistanceFromStart =
      clientX - containerRef.current.getBoundingClientRect().left
    const time =
      (pxDistanceFromStart / width) * (visibleTimeEnd - visibleTimeStart) +
      visibleTimeStart
    rootAudioElm.currentTime = time / 1000
    setTimeCursorTime(time)
  })

  return (
    <Container
      ref={containerRef}
      themecolors={themecolors}
      width={width}
      onClick={rootAudioElm ? onClickTimeline : undefined}
    >
      {range(timeTextCount).map((timeTextIndex) => (
        <TimeText
          key={timeTextIndex}
          x={(timeTextIndex / timeTextCount) * width}
          faded={(timeTextTimes[timeTextIndex] < 0).toString()}
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
              stroke={themecolors.base01}
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
      {timeCursorTime !== undefined && (
        <TimeCursor
          themecolors={themecolors}
          left={((timeCursorTime - visibleTimeStart) / visibleDuration) * width}
        />
      )}
    </Container>
  )
}

export default Timeline
