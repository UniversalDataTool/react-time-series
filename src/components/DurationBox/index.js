import React from "react"
import { styled } from "@material-ui/core/styles"
import colorAlpha from "color-alpha"

const Container = styled("div")(({ width, active, color }) => ({
  width,
  height: 20,
  borderBottom: "1px solid rgba(0,0,0, 0.2)",
  position: "relative",
  overflow: "hidden",
  cursor: "pointer",
  backgroundColor: active ? colorAlpha(color, 0.2) : "rgba(0,0,0,0)",
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.2)",
  },
}))
const Box = styled("div")(({ x, width, color }) => ({
  position: "absolute",
  left: x,
  width,
  opacity: 0.8,
  backgroundColor: color,
  height: 20,
}))

export const DurationBox = ({
  width,
  color,
  active,
  durations,
  visibleTimeStart,
  visibleTimeEnd,
  onClick,
}) => {
  const visibleDuration = visibleTimeEnd - visibleTimeStart

  return (
    <Container onClick={onClick} width={width} color={color} active={active}>
      {durations.map(({ start: startTime, end: endTime }) => {
        const startX =
          ((startTime - visibleTimeStart) / visibleDuration) * width
        const endX = ((endTime - visibleTimeStart) / visibleDuration) * width

        return <Box color={color} x={startX} width={endX - startX} />
      })}
    </Container>
  )
}

export default DurationBox
