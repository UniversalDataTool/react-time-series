import React from "react"
import DurationBox from "./"

export default {
  title: "DurationBox",
  component: DurationBox,
  argTypes: {},
}

export const Primary = () => (
  <div>
    <DurationBox
      color="#f00"
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
    <DurationBox
      color="#0f0"
      active
      width={500}
      durations={[
        { start: 150, end: 200 },
        {
          start: 550,
          end: 1000,
        },
      ]}
      visibleTimeStart={0}
      visibleTimeEnd={1000}
    />
    <DurationBox
      color="#00f"
      width={500}
      durations={[
        { start: 200, end: 400 },
        {
          start: 700,
          end: 750,
        },
      ]}
      visibleTimeStart={0}
      visibleTimeEnd={1000}
    />
  </div>
)
