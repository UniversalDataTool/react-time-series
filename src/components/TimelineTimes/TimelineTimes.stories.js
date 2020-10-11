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
