import React from "react"
import Toolbar from "./"
import { solarized } from "../../hooks/use-colors"

export default {
  title: "Toolbar",
  component: Toolbar,
}

export const Primary = () => {
  return (
    <Toolbar
      timestamps={[
        {
          color: solarized.red,
          time: 100,
        },
      ]}
      selectedTimestampIndex={null}
    />
  )
}
