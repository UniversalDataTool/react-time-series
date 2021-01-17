import React from "react"
import { styled } from "@material-ui/core/styles"
import useColors from "../../hooks/use-colors"

export const BackgroundContainer = ({ children }) => {
  const themeColors = useColors()
  const Container = styled("div")(() => ({
    backgroundColor: themeColors.bg,
  }))
  return <Container>{children}</Container>
}

export default BackgroundContainer
