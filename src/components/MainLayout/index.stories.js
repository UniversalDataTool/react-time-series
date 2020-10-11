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
    curveGroups={[
      [
        { data: tesla.curve2018, color: "#f00" },
        { data: tesla.curve2017, color: "#00f" },
      ],
    ]}
  />
)
