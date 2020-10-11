import React from "react"

import TimelineTimes from "./"

export default {
  title: "TimelineTimes",
  component: TimelineTimes,
}

export const Primary = () => {
  return (
    <TimelineTimes
      timeFormat="timecolons"
      width={500}
      visibleTimeStart={0}
      visibleTimeEnd={60000 * 80}
    />
  )
}
