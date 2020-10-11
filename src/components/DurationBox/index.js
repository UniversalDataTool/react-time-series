import React from "react"
import { styled } from "@material-ui/core/styles"

const Container = styled("div")(({ width }) => ({
  width,
  height: 20,
  position: "relative",
  overflow: "hidden",
}))
const Box = styled("div")(({ x, width }) => ({
  position: "absolute",
  left: x,
  width,
  backgroundColor: "#f00",
  height: 20,
}))

export const DurationBox = ({
  width,
  durations,
  visibleTimeStart,
  visibleTimeEnd,
}) => {
  const visibleDuration = visibleTimeEnd - visibleTimeStart

  return (
    <Container width={width}>
      {durations.map(({ start: startTime, end: endTime }) => {
        const startX =
          ((startTime - visibleTimeStart) / visibleDuration) * width
        const endX = ((endTime - visibleTimeStart) / visibleDuration) * width

        return <Box x={startX} width={endX - startX} />
      })}
    </Container>
  )
}

export default DurationBox
