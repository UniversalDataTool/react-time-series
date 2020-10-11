import React from "react"
import Wave from "../Wave"
import { styled } from "@material-ui/core/styles"

const Container = styled("div")({
  width: "80vw",
  height: "80vh",
  backgroundColor: "#888",
})

export const MainLayout = () => {
  return (
    <Container>
      <Wave />
    </Container>
  )
}

export default MainLayout
