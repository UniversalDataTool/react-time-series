import React from "react"

import useColors from "../../hooks/use-colors"
import Timeline from "./"
import getMinorMajorDurationLines from "../../utils/get-minor-major-duration-lines"
import Matrix from "immutable-transform-matrix"

export default {
  title: "Timeline",
  component: Timeline,
  argTypes: {
    width: "number",
    onClickTimestamp: { action: "onClickTimestamp" },
  },
}

export const TimeWithColons = (args) => {
  return (
    <Timeline
      {...args}
      timeFormat="timecolons"
      width={500}
      visibleTimeStart={0}
      visibleTimeEnd={60000 * 80}
      gridLineMetrics={getMinorMajorDurationLines(new Matrix(), 500)}
    />
  )
}

export const Dates = (args) => {
  return (
    <Timeline
      {...args}
      timeFormat="dates"
      width={500}
      visibleTimeStart={0}
      visibleTimeEnd={60000 * 60 * 24 * 400}
      gridLineMetrics={getMinorMajorDurationLines(new Matrix(), 500)}
    />
  )
}

export const TimeWithTimestamps = (args) => {
  const colors = useColors()
  return (
    <Timeline
      {...args}
      timeFormat="timecolons"
      width={500}
      visibleTimeStart={0}
      visibleTimeEnd={60000 * 80}
      timestamps={[
        { time: 10 * 60000, color: colors.cyan },
        { time: 50 * 60000, color: colors.red },
      ]}
      gridLineMetrics={getMinorMajorDurationLines(new Matrix(), 500)}
    />
  )
}

export const TimeWithTextMarkers = (args) => {
  const colors = useColors()
  return (
    <Timeline
      {...args}
      timeFormat="timecolons"
      width={500}
      visibleTimeStart={0}
      visibleTimeEnd={60000 * 80}
      timestamps={[
        { time: 10 * 60000, color: colors.cyan, label: "Timestamp 1" },
        { time: 50 * 60000, color: colors.red, label: "Another Timestamp" },
      ]}
      gridLineMetrics={getMinorMajorDurationLines(new Matrix(), 500)}
    />
  )
}
