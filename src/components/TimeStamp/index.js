import React from "react"
import { styled } from "@material-ui/core/styles"
import LocationOnIcon from "@material-ui/icons/LocationOn"
import Color from "color"
import useColors from "../../hooks/use-colors"

export const Container = styled("div")(
  ({ left, color, textColor, hasIcon }) => ({
    position: "absolute",
    bottom: 0,
    fontSize: 11,
    fontWeight: 600,
    ...(hasIcon
      ? {}
      : {
          padding: 4,
          paddingLeft: 6,
          paddingRight: 6,
          backgroundColor: Color(color).darken(0.5).string(),
        }),
    left: left - 6,
    color: "#fff",
    cursor: "pointer",
    transition: "transform 150ms",
    "&:hover": {
      transform: "translate(0px, -1px)",
    },
    "& .icon": {
      color: color,
      width: 12,
      height: 12,
    },
  })
)

export const TimeStamp = ({ left, color, label }) => {
  const themeColors = useColors()
  return (
    <Container left={left} color={color} hasIcon={!Boolean(label)}>
      {label ? <span>{label}</span> : <LocationOnIcon className="icon" />}
    </Container>
  )
}

export default TimeStamp
