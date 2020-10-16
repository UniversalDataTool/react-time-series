import React, { useState } from "react"

import MainLayout from "./"
import tesla from "./tesla.json"

export default {
  title: "MainLayout",
  component: MainLayout,
  argTypes: {},
}

export const Primary = () => {
  const [durationGroups, setDurationGroups] = useState([
    {
      color: "#f00",
      durations: [
        {
          start: 1537416000000,
          end: 1539316800000,
        },
      ],
    },
    {
      color: "#00f",
      durations: [],
    },
  ])

  const [timestamps, setTimestamps] = useState([
    {
      color: "#0f0",
      time: 1520398800000,
    },
  ])

  return (
    <MainLayout
      timeFormat="dates"
      curveGroups={[
        [
          { data: tesla.curve2018, color: "#f00" },
          { data: tesla.curve2017, color: "#00f" },
        ],
        [
          {
            data: tesla.curve2017
              .concat(tesla.curve2018)
              .filter((_, i) => i % 10 === 0)
              .sort((a, b) => a[0] - b[0]),
            color: "#0f0",
          },
        ],
      ]}
      durationGroups={durationGroups}
      timestamps={timestamps}
      onChangeTimestamps={setTimestamps}
      onChangeDurationGroups={setDurationGroups}
    />
  )
}
