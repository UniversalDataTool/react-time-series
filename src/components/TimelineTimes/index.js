import React from "react"
import range from "lodash/range"
import { styled } from "@material-ui/core/styles"

const Container = styled("div")({})

const Tick = styled("div")({
  position: "absolute",
})

export const TimelineTimes = ({
  visibleTimeStart,
  visibleTimeEnd,
  visibleDuration,
  width,
}) => {
  // TODO compute tick count using width
  const tickCount = 3

  return (
    <Container width={width}>
      {range(tickCount).map((tick) => (
        <Tick>{tick}</Tick>
      ))}
    </Container>
  )
}

export default TimelineTimes
