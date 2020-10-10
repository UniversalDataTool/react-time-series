import React from "react"

import TimelineTimes from "./"

export default {
  title: "TimelineTimes",
  component: TimelineTimes,
}

export const Primary = () => {
  return (
    <TimelineTimes
      timeFormat="none"
      width={500}
      visibleTimeStart={0}
      visibleTimeEnd={1000}
      visibleDuration={1000}
    />
  )
}
