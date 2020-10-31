import React, { Fragment } from "react"
import range from "lodash/range"
import { styled } from "@material-ui/core/styles"
import colorAlpha from "color-alpha"
import useColors from "../../hooks/use-colors"
import { formatTime } from "../../utils/format-time"

const userSelectOffStyle = { userSelect: "none" }

const Container = styled("div")({})

const reduceForVisibleDuration = (data, startTime, visibleDuration) => {
  const firstInnerIndex = data.findIndex(([t]) => t >= startTime)
  let visibleSamples = data
    .slice(firstInnerIndex)
    .findIndex(([t]) => t >= startTime + visibleDuration)
  visibleSamples =
    visibleSamples === -1 ? data.length - firstInnerIndex : visibleSamples
  const lastInnerIndex = firstInnerIndex + visibleSamples

  data = data.slice(Math.max(0, firstInnerIndex - 1), lastInnerIndex + 1)

  const minDistance = visibleDuration / 200
  const points = [data[0]]
  let lastAddedPointIndex = 0
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] - points[points.length - 1][0] > minDistance) {
      // points.push(data[i])
      const timeSinceLastPoint = data[i][0] - points[points.length - 1][0]

      points.push([
        data[i][0] - timeSinceLastPoint / 2,
        Math.max(
          ...data.slice(lastAddedPointIndex + 1, i + 1).map(([, v]) => v)
        ),
      ])

      points.push([
        data[i][0],
        Math.min(
          ...data.slice(lastAddedPointIndex + 1, i + 1).map(([, v]) => v)
        ),
      ])

      lastAddedPointIndex = i
    }
  }
  return points
}

export const Wave = ({
  curves,
  width,
  height,
  transformMatrix,
  durationGroups = [],
  timestamps = [],
  gridLineMetrics,
}) => {
  const colors = useColors()

  const {
    visibleDuration,
    startTimeOnGraph,
    majorDuration,
    numberOfMajorGridLines,
    numberOfMinorGridLines,
    majorGridLinePixelOffset,
    minorGridLinePixelOffset,
    majorGridLinePixelDistance,
    minorGridLinePixelDistance,
  } = gridLineMetrics

  return (
    <Container style={{ curves, width, height }}>
      <svg width={width} height={height}>
        {range(-5, numberOfMajorGridLines + 1).map((i) => {
          const timeAtLine =
            Math.floor(startTimeOnGraph / majorDuration) * majorDuration +
            majorDuration * i

          const lineX =
            majorGridLinePixelOffset + majorGridLinePixelDistance * i

          const globalTimelineIndex = Math.floor(timeAtLine / majorDuration)

          let textElm = null
          if (globalTimelineIndex % 7 === 0) {
            const timeLines = formatTime(
              timeAtLine,
              "dates",
              visibleDuration
            ).split("\n")
            textElm = timeLines.map((tl, i) => (
              <text
                key={i}
                x={lineX + 5}
                y={12 + i * 12}
                fill={colors.base0}
                fontSize={12}
                pointerEvents="none"
                style={userSelectOffStyle}
              >
                {tl}
              </text>
            ))
          }

          return (
            <Fragment key={i}>
              {i >= 0 && (
                <line
                  opacity={0.5}
                  stroke={colors.base01}
                  x1={lineX}
                  x2={lineX}
                  y1={0}
                  y2={height}
                />
              )}
              {textElm}
            </Fragment>
          )
        })}
        {numberOfMajorGridLines < 12 &&
          range(numberOfMinorGridLines).map((i) => {
            const lineX =
              minorGridLinePixelOffset + minorGridLinePixelDistance * i
            return (
              <line
                key={i}
                opacity={0.25}
                stroke={colors.base01}
                x1={lineX}
                x2={lineX}
                y1={0}
                y2={height}
              />
            )
          })}
        {durationGroups.flatMap(({ durations, color }, dgi) => {
          return durations.map((duration, di) => {
            const { x: startX } = transformMatrix.applyToPoint(
              duration.start,
              0
            )
            const { x: endX } = transformMatrix.applyToPoint(duration.end, 0)
            if (isNaN(startX) || isNaN(endX)) return null
            return (
              <rect
                key={`${dgi},${di}`}
                fill={colorAlpha(color, 0.2)}
                x={startX}
                y={0}
                width={endX - startX}
                height={height}
              />
            )
          })
        })}
        {curves.map((curve, i) => (
          <polyline
            key={i}
            stroke={curve.color}
            fill="transparent"
            points={reduceForVisibleDuration(
              curve.data,
              startTimeOnGraph,
              visibleDuration
            )
              .map(([t, y]) => {
                const p = transformMatrix.applyToPoint(t, y)
                return `${p.x},${p.y}`
              })
              .join(" ")}
          />
        ))}
        {timestamps.map((ts, i) => {
          const { x } = transformMatrix.applyToPoint(ts.time, 0)
          return (
            <line
              key={i}
              x1={x}
              x2={x}
              y1={0}
              y2={height}
              stroke={ts.color}
              strokeWidth={1}
            />
          )
        })}
      </svg>
    </Container>
  )
}

export default Wave
