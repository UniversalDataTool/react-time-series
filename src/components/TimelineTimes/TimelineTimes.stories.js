import React from "react"

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
  return (
    <TimelineTimes
      timeFormat="timecolons"
      width={500}
      visibleTimeStart={0}
      visibleTimeEnd={60000 * 80}
      timestamps={[
        { time: 10 * 60000, color: "#f00" },
        { time: 50 * 60000, color: "#00f" },
      ]}
    />
  )
}
