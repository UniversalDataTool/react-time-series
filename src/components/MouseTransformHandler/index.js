import React, { useState, useRef } from "react"
import { styled } from "@material-ui/core/styles"
import useEventCallback from "use-event-callback"
import Matrix from "immutable-transform-matrix"
import Wave from "../Wave"

import range from "lodash/range"

const curve1 = {
  color: "#f00",
  data: range(500).map((i) => [i, Math.sin(i / 20) * 100]),
}

const curve2 = {
  color: "#00f",
  data: range(500).map((i) => [i, Math.cos(i / 40) * 100]),
}

const Container = styled("div")({
  width: 500,
  height: 200,
  backgroundColor: "#eee",
})

export const MouseTransformHandler = ({ content }) => {
  const [matrix, setMatrix] = useState(new Matrix())
  const mousePosition = useRef({ x: 0, y: 0 })
  const [middleMouseDown, setMiddleMouseDown] = useState(false)
  const containerRef = useRef()

  const projectMouse = useEventCallback((e) => {
    const { clientX, clientY } = e

    const rect = containerRef.current.getBoundingClientRect()

    const xRelToElm = clientX - rect.x
    const yRelToElm = clientY - rect.y

    return matrix.inverse().applyToPoint(xRelToElm, yRelToElm)
  })

  const onMouseMove = useEventCallback((e) => {
    const { clientX, clientY } = e

    const projectedMouse = projectMouse(e)

    if (middleMouseDown) {
      const delta = {
        x: clientX - mousePosition.current.x,
        y: clientY - mousePosition.current.y,
      }
      const scaleFac = matrix.get("a")
      setMatrix(matrix.translate(delta.x / scaleFac, delta.y / scaleFac))
    }

    mousePosition.current = {
      x: clientX,
      y: clientY,
      px: projectedMouse.x,
      py: projectedMouse.y,
    }
  })
  const onMouseDown = useEventCallback((e) => {
    const { clientX, clientY, button } = e
    const projectedMouse = projectMouse(e)
    mousePosition.current = {
      x: clientX,
      y: clientY,
      px: projectedMouse.x,
      py: projectedMouse.y,
    }
    if (button === 1) {
      setMiddleMouseDown(true)
    }
  })
  const onMouseUp = useEventCallback((e) => {
    if (e.button === 1) {
      setMiddleMouseDown(false)
    }
  })
  const onWheel = useEventCallback((e) => {
    const { deltaY } = e
    const scroll = -deltaY / 1000

    const { px, py } = mousePosition.current
    setMatrix(
      matrix
        .translate(px, py)
        .scale(1 + scroll)
        .translate(-px, -py)
    )
  })

  // TODO
  return (
    <Container
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onWheel={onWheel}
    >
      <Wave
        curves={[curve1, curve2]}
        width={500}
        height={200}
        transformMatrix={matrix}
      />
    </Container>
  )
}

export default MouseTransformHandler
