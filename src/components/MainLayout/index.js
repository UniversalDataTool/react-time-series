import React, { useState } from "react"
import TimelineTimes from "../TimelineTimes"
import { styled } from "@material-ui/core/styles"
import range from "lodash/range"
import Matrix from "immutable-transform-matrix"
import useTimeRange from "../../hooks/use-time-range.js"
import ControllableWave from "../ControllableWave"
import useRafState from "react-use/lib/useRafState"

const Container = styled("div")({
  width: "80vw",
  height: "80vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#ddd",
})

export const MainLayout = ({ curveGroups }) => {
  const width = 500

  const [topLevelMatrix, setTopLevelMatrix] = useRafState(() => {
    const mat = new Matrix()

    const allTimes = curveGroups
      .flatMap((curveGroup) => curveGroup)
      .flatMap((curve) => curve.data.map(([t]) => t))
    const minT = Math.min(...allTimes)
    const maxT = Math.max(...allTimes)

    return mat
      .scale(width, 1)
      .scale(1 / (maxT - minT), 1)
      .translate(-minT, 0)
  })
  const { visibleTimeStart, visibleTimeEnd } = useTimeRange(topLevelMatrix, 500)

  return (
    <Container>
      <TimelineTimes
        width={width}
        visibleTimeStart={visibleTimeStart}
        visibleTimeEnd={visibleTimeEnd}
      />
      {curveGroups.map((curves, i) => (
        <ControllableWave
          key={i}
          curves={curves}
          width={width}
          height={200}
          topLevelMatrix={topLevelMatrix}
          setTopLevelMatrix={setTopLevelMatrix}
        />
      ))}
    </Container>
  )
}

export default MainLayout
