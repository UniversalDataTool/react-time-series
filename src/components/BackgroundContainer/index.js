import React from "react"
import { styled } from "@material-ui/core/styles"
import useColors from "../../hooks/use-colors"

const Container = styled("div")(({ themeColors }) => ({
  backgroundColor: themeColors.bg,
}))

export const BackgroundContainer = ({ children }) => {
  const themeColors = useColors()
  return <Container themeColors={themeColors}>{children}</Container>
}

export default BackgroundContainer
