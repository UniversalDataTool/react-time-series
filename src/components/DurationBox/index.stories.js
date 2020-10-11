import React from "react"
import DurationBox from "./"

export default {
  title: "DurationBox",
  component: DurationBox,
  argTypes: {},
}

export const Primary = () => (
  <DurationBox
    width={500}
    durations={[
      { start: 0, end: 100 },
      {
        start: 500,
        end: 800,
      },
    ]}
    visibleTimeStart={0}
    visibleTimeEnd={1000}
  />
)
