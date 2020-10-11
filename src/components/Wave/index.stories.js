import React from "react"
import range from "lodash/range"
import Matrix from "immutable-transform-matrix"

import Wave from "./"

export default {
  title: "Wave",
  component: Wave,
  argTypes: {},
}

const curve1 = {
  color: "#f00",
  data: range(500).map((i) => [i, Math.sin(i / 20) * 100]),
}

const curve2 = {
  color: "#00f",
  data: range(500).map((i) => [i, Math.cos(i / 40) * 100]),
}

export const SingleCurve = () => (
  <Wave
    curves={[curve1]}
    width={500}
    height={200}
    transformMatrix={new Matrix().translate(0, 100)}
  />
)

export const DoubleCurve = () => (
  <Wave
    curves={[curve1, curve2]}
    width={500}
    height={200}
    transformMatrix={new Matrix().translate(0, 100)}
  />
)

export const DoubleCurveWithDuration = () => (
  <Wave
    curves={[curve1, curve2]}
    width={500}
    height={200}
    transformMatrix={new Matrix().translate(0, 100)}
    durationGroups={[
      {
        color: "#f00",
        durations: [{ start: 100, end: 400 }],
      },
    ]}
  />
)
