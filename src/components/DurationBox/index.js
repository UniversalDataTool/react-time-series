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
const Label = styled("div")({
  position: "absolute",
  left: 4,
  top: 0,
  color: "#fff",
  mixBlendMode: "overlay",
})

export const DurationBox = ({
  width,
  color,
  active,
  durations,
  visibleTimeStart,
  visibleTimeEnd,
  onClick,
  onRemoveBox,
  label = "testing label",
}) => {
  const visibleDuration = visibleTimeEnd - visibleTimeStart

  return (
    <Container onClick={onClick} width={width} color={color} active={active}>
      {durations.map(({ start: startTime, end: endTime }, i) => {
        const startX =
          ((startTime - visibleTimeStart) / visibleDuration) * width
        const endX = ((endTime - visibleTimeStart) / visibleDuration) * width

        if (endX < 0) return null
        if (isNaN(startX) || isNaN(endX)) return null

        return (
          <Box
            color={color}
            x={startX}
            width={endX - startX}
            onMouseUp={(e) => {
              if (e.button === 2) {
                onRemoveBox(i)
              }
            }}
            onContextMenu={(e) => {
              e.preventDefault()
            }}
          />
        )
      })}
      {label && <Label key="label">{label}</Label>}
    </Container>
  )
}

export default DurationBox
