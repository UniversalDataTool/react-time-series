import React from "react"
import range from "lodash/range"
import { styled } from "@material-ui/core/styles"

const Container = styled("div")({})

export const Wave = ({ curves, width, height, transformMatrix }) => {
  return (
    <Container style={{ curves, width, height }}>
      <svg width={width} height={height}>
        {curves.map((curve, i) => (
          <polyline
            key={i}
            stroke={curve.color}
            fill="transparent"
            points={curve.data
              .map(([t, y]) => {
                const p = transformMatrix.applyToPoint(t, y)
                return `${p.x},${p.y}`
              })
              .join(" ")}
          />
        ))}
      </svg>
    </Container>
  )
}

export default Wave
