import React, { Fragment } from "react"
import range from "lodash/range"
import { styled } from "@material-ui/core/styles"
import colorAlpha from "color-alpha"
import useColors from "../../hooks/use-colors"
import { formatTime } from "../TimelineTimes"

const Container = styled("div")({})

const mins = 1000 * 60
const hours = 60 * mins
const days = 24 * hours
const weeks = 7 * days
const months = 30 * days
const years = 12 * months
const timeIntervals = [
  1,
  5,
  50,
  500,
  1000,
  10000,
  mins,
  30 * mins,
  hours,
  8 * hours,
  days,
  weeks,
  months,
  months * 3,
  years,
]

const findReasonableGridDuration = (duration) => {
  let bestFittingIntervalIndex = 0
  let bestFittingIntervalScore = -Infinity
  for (const [i, timeInterval] of Object.entries(timeIntervals)) {
    const timeIntervalScore = -1 * Math.abs(duration / timeInterval - 20)
    if (timeIntervalScore > bestFittingIntervalScore) {
      bestFittingIntervalIndex = i
      bestFittingIntervalScore = timeIntervalScore
    }
  }
  return [
    timeIntervals[bestFittingIntervalIndex],
    timeIntervals[bestFittingIntervalIndex - 1],
  ]
}

export const Wave = ({
  curves,
  width,
  height,
  transformMatrix,
  durationGroups = [],
  timestamps = [],
}) => {
  const colors = useColors()

  const { x: startTimeOnGraph } = transformMatrix.inverse().applyToPoint(0, 0)
  const { x: endTimeOnGraph } = transformMatrix.inverse().applyToPoint(500, 0)

  const [majorDuration, minorDuration] = findReasonableGridDuration(
    endTimeOnGraph - startTimeOnGraph
  )

  const numberOfMajorGridLines = Math.ceil(
    (endTimeOnGraph - startTimeOnGraph) / majorDuration
  )

  const numberOfMinorGridLines = Math.ceil(
    (endTimeOnGraph - startTimeOnGraph) / minorDuration
  )

  return (
    <Container style={{ curves, width, height }}>
      <svg width={width} height={height}>
        {range(-5, numberOfMajorGridLines + 1).map((i) => {
          const timeAtLine =
            Math.floor(startTimeOnGraph / majorDuration) * majorDuration +
            majorDuration * i

          const { x: lineX } = transformMatrix.applyToPoint(timeAtLine, 0)

          const globalTimelineIndex = Math.floor(timeAtLine / majorDuration)

          let textElm = null
          if (
            globalTimelineIndex % Math.floor(numberOfMajorGridLines / 2) ===
            0
          ) {
            textElm = (
              <text x={lineX + 5} y={12} fill={colors.Selection} fontSize={12}>
                {formatTime(timeAtLine, "dates")}
              </text>
            )
          }

          return (
            <Fragment key={i}>
              {i >= 0 && (
                <line
                  stroke={colors.Selection}
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
        {range(numberOfMinorGridLines).map((i) => {
          const { x: lineX } = transformMatrix.applyToPoint(
            Math.floor(startTimeOnGraph / minorDuration) * minorDuration +
              minorDuration * i,
            0
          )

          return (
            <line
              key={i}
              opacity={0.25}
              stroke={colors.Selection}
              x1={lineX}
              x2={lineX}
              y1={0}
              y2={height}
            />
          )
        })}
        {durationGroups.flatMap(({ durations, color }) => {
          return durations.map((duration) => {
            const { x: startX } = transformMatrix.applyToPoint(
              duration.start,
              0
            )
            const { x: endX } = transformMatrix.applyToPoint(duration.end, 0)
            return (
              <rect
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
            points={curve.data
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
