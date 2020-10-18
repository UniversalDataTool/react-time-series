import React from "react"

import useColors from "../../hooks/use-colors"
import TimelineTimes from "./"

export default {
  title: "TimelineTimes",
  component: TimelineTimes,
}

export const TimeWithColons = () => {
  return (
    <TimelineTimes
      timeFormat="timecolons"
      width={500}
      visibleTimeStart={0}
      visibleTimeEnd={60000 * 80}
    />
  )
}

export const Dates = () => {
  return (
    <TimelineTimes
      timeFormat="dates"
      width={500}
      visibleTimeStart={0}
      visibleTimeEnd={60000 * 60 * 24 * 400}
    />
  )
}

export const TimeWithTimestamps = () => {
  const colors = useColors()
  return (
    <TimelineTimes
      timeFormat="timecolons"
      width={500}
      visibleTimeStart={0}
      visibleTimeEnd={60000 * 80}
      timestamps={[
        { time: 10 * 60000, color: colors.Cyan },
        { time: 50 * 60000, color: colors.Red },
      ]}
    />
  )
}

export const TimeWithTextMarkers = () => {
  const colors = useColors()
  return (
    <TimelineTimes
      timeFormat="timecolons"
      width={500}
      visibleTimeStart={0}
      visibleTimeEnd={60000 * 80}
      timestamps={[
        { time: 10 * 60000, color: colors.Cyan, label: "Timestamp 1" },
        { time: 50 * 60000, color: colors.Red, label: "Another Timestamp" },
      ]}
    />
  )
}
