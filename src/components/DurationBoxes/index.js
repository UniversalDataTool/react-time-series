import React from "react"
import { styled } from "@material-ui/core/styles"
import colorAlpha from "color-alpha"
import useColors from "../../hooks/use-colors"
import useToolMode from "../../hooks/use-tool-mode"

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
  overflow: "hidden",
  opacity: 0.8,
  backgroundColor: color,
  height: 20,
  "& div": {
    paddingLeft: 4,
    mixBlendMode: "hardlight",
    whiteSpace: "pre",
    color: "#fff",
  },
}))
const Label = styled("div")(({ colors }) => ({
  position: "absolute",
  pointerEvents: "none",
  left: 4,
  top: 0,
  ...(colors.dark
    ? { mixBlendMode: "overlay", color: "#fff" }
    : {
        mixBlendMode: "multiply",
        color: "#888",
      }),
}))

export const DurationBox = ({
  width,
  color,
  active,
  durations,
  visibleTimeStart,
  visibleTimeEnd,
  onClick,
  onRemoveBox,
  onClickBox,
  isMiscLayer = false,
  label = "",
}) => {
  const [toolMode] = useToolMode()
  const colors = useColors()
  const visibleDuration = visibleTimeEnd - visibleTimeStart

  return (
    <Container onClick={onClick} width={width} color={color} active={active}>
      {durations.map(
        (
          {
            start: startTime,
            end: endTime,
            label: durationLabel,
            color: durationColor,
          },
          i
        ) => {
          const startX =
            ((startTime - visibleTimeStart) / visibleDuration) * width
          const endX = ((endTime - visibleTimeStart) / visibleDuration) * width

          if (endX < 0) return null
          if (isNaN(startX) || isNaN(endX)) return null

          return (
            <Box
              key={i}
              color={durationColor || color}
              x={startX}
              width={endX - startX}
              onClick={() => onClickBox(i)}
              onMouseUp={(e) => {
                if (toolMode === "delete" || e.button === 2 || e.button === 1) {
                  onRemoveBox(i)
                }
              }}
              onContextMenu={(e) => {
                e.preventDefault()
              }}
            >
              <div>{durationLabel}</div>
            </Box>
          )
        }
      )}
      {(label || (isMiscLayer && durations.length === 0)) && (
        <Label colors={colors} key="label">
          {isMiscLayer && durations.length === 0
            ? "click to create durations"
            : label}
        </Label>
      )}
    </Container>
  )
}

export default DurationBox
