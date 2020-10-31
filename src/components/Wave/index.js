import React, { Fragment, useMemo } from "react"
import range from "lodash/range"
import { styled } from "@material-ui/core/styles"
import colorAlpha from "color-alpha"
import useColors from "../../hooks/use-colors"
import { formatTime } from "../../utils/format-time"
import HighlightValueLabels from "../HighlightValueLabels"

const userSelectOffStyle = {
  userSelect: "none",
  whiteSpace: "pre",
  fontVariantNumeric: "tabular-nums",
}

const reduceForVisibleDuration = (data, startTime, visibleDuration, width) => {
  const firstInnerIndex = data.findIndex(([t]) => t >= startTime)
  let visibleSamples = data
    .slice(firstInnerIndex)
    .findIndex(([t]) => t >= startTime + visibleDuration)
  visibleSamples =
    visibleSamples === -1 ? data.length - firstInnerIndex : visibleSamples
  const lastInnerIndex = firstInnerIndex + visibleSamples

  data = data.slice(Math.max(0, firstInnerIndex - 1), lastInnerIndex + 1)

  const minDistance = visibleDuration / (width / 4)
  const points = [data[0]]
  let lastAddedPointIndex = 0
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] - points[points.length - 1][0] > minDistance) {
      // points.push(data[i])
      const timeSinceLastPoint = data[i][0] - points[points.length - 1][0]
      if (i - lastAddedPointIndex === 1) {
        points.push(data[i])
      } else {
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
      }

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
  timeFormat,
  durationGroups = [],
  timestamps = [],
  gridLineMetrics,
  showValues = false,
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

  const visibleTransformedPointsOnCurves = useMemo(() => {
    const visibleTransformedPointsOnCurves = []
    for (const curve of curves) {
      visibleTransformedPointsOnCurves.push(
        reduceForVisibleDuration(
          curve.data,
          startTimeOnGraph,
          visibleDuration,
          width
        ).map(([t, y]) => ({
          ...transformMatrix.applyToPoint(t, y),
          t,
          value: y,
        }))
      )
    }
    return visibleTransformedPointsOnCurves
  }, [transformMatrix, curves, startTimeOnGraph, visibleDuration, width])

  return (
    <svg width={width} height={height}>
      {range(-5, numberOfMajorGridLines + 1).map((i) => {
        const timeAtLine =
          Math.floor(startTimeOnGraph / majorDuration) * majorDuration +
          majorDuration * i

        const lineX = majorGridLinePixelOffset + majorGridLinePixelDistance * i

        const globalTimelineIndex = Math.floor(timeAtLine / majorDuration)

        let textElm = null
        if (globalTimelineIndex % 1 === 0) {
          const timeLines = formatTime(
            timeAtLine,
            timeFormat,
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
      {durationGroups.flatMap(({ durations, color: dgColor }, dgi) => {
        return durations.map((duration, di) => {
          const { x: startX } = transformMatrix.applyToPoint(duration.start, 0)
          const { x: endX } = transformMatrix.applyToPoint(duration.end, 0)
          if (isNaN(startX) || isNaN(endX)) return null
          return (
            <rect
              key={`${dgi},${di}`}
              fill={colorAlpha(duration.color || dgColor, 0.2)}
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
          points={visibleTransformedPointsOnCurves[i]
            .map((p) => `${p.x},${p.y}`)
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
      {showValues && (
        <HighlightValueLabels
          visibleTransformedPointsOnCurves={visibleTransformedPointsOnCurves}
          curveColors={curves.map((c) => c.color)}
        />
      )}
    </svg>
  )
}

export default Wave
