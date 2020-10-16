import React from "react"
import range from "lodash/range"
import { styled } from "@material-ui/core/styles"
import colorAlpha from "color-alpha"
import useColors from "../../hooks/use-colors"

const Container = styled("div")({})

const mins = 1000 * 60
const hours = 60 * mins
const days = 24 * hours
const weeks = 7 * days
const months = 30 * days
const years = 12 * months
console.log({
  mins,
  hours,
  days,
  weeks,
  months,
  years,
})
const timeIntervals = [100, 1000, mins, hours, days, weeks, months, years]

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
  return timeIntervals[bestFittingIntervalIndex]
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

  const gridDuration = findReasonableGridDuration(
    endTimeOnGraph - startTimeOnGraph
  )
  const numberOfGridLines = Math.ceil(
    (endTimeOnGraph - startTimeOnGraph) / gridDuration
  )

  return (
    <Container style={{ curves, width, height }}>
      <svg width={width} height={height}>
        {range(numberOfGridLines + 1).map((i) => {
          const { x: lineX } = transformMatrix.applyToPoint(
            Math.floor(startTimeOnGraph / gridDuration) * gridDuration +
              gridDuration * i,
            0
          )

          return (
            <line
              key={i}
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
