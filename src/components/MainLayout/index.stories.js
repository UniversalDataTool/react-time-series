import React from "react"

import MainLayout from "./"
import tesla from "./tesla.json"

export default {
  title: "MainLayout",
  component: MainLayout,
  argTypes: {},
}

export const Primary = () => (
  <MainLayout
    timeFormat="dates"
    curveGroups={[
      [
        { data: tesla.curve2018, color: "#f00" },
        { data: tesla.curve2017, color: "#00f" },
      ],
    ]}
    durationGroups={[
      {
        color: "#f00",
        durations: [
          {
            start: 1537416000000,
            end: 1539316800000,
          },
        ],
      },
    ]}
  />
)
