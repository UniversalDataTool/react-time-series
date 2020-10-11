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

const curve1 = {
  color: "#f00",
  data: range(500).map((i) => [i, Math.sin(i / 20) * 100]),
}

const curve2 = {
  color: "#00f",
  data: range(500).map((i) => [i, Math.sin(i / 20) * 20]),
}

export const MainLayout = () => {
  const [topLevelMatrix, setTopLevelMatrix] = useRafState(new Matrix())
  const { visibleTimeStart, visibleTimeEnd } = useTimeRange(topLevelMatrix, 500)

  return (
    <Container>
      <TimelineTimes
        width={500}
        visibleTimeStart={visibleTimeStart}
        visibleTimeEnd={visibleTimeEnd}
      />
      <ControllableWave
        curve={curve1}
        topLevelMatrix={topLevelMatrix}
        setTopLevelMatrix={setTopLevelMatrix}
      />
      <ControllableWave
        curve={curve2}
        topLevelMatrix={topLevelMatrix}
        setTopLevelMatrix={setTopLevelMatrix}
      />
    </Container>
  )
}

export default MainLayout
