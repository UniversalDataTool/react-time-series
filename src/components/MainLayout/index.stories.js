import React, { useState } from "react"

import MainLayout from "./"
import tesla from "./tesla.json"
import { draculaTheme } from "../../hooks/use-colors"

export default {
  title: "MainLayout",
  component: MainLayout,
  argTypes: {},
}

export const Primary = () => {
  const [durationGroups, setDurationGroups] = useState([
    {
      color: draculaTheme.Cyan,
      durations: [
        {
          start: 1537416000000,
          end: 1539316800000,
        },
      ],
    },
    {
      color: draculaTheme.Pink,
      durations: [],
    },
  ])

  const [timestamps, setTimestamps] = useState([
    {
      color: draculaTheme.Red,
      time: 1520398800000,
    },
  ])

  return (
    <MainLayout
      timeFormat="dates"
      curveGroups={[
        [
          { data: tesla.curve2018, color: draculaTheme.Yellow },
          { data: tesla.curve2017, color: draculaTheme.Green },
        ],
        [
          {
            data: tesla.curve2017
              .concat(tesla.curve2018)
              .filter((_, i) => i % 10 === 0)
              .sort((a, b) => a[0] - b[0]),
            color: draculaTheme.Green,
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
