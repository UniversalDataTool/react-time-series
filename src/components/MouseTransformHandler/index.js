import React, { useState, useRef, useEffect } from "react"
import { styled } from "@material-ui/core/styles"
import useEventCallback from "use-event-callback"
import Matrix from "immutable-transform-matrix"
import Wave from "../Wave"
import useRafState from "react-use/lib/useRafState"

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

export const MouseTransformHandler = ({
  children,
  matrix,
  onChangeMatrix,
  onDragDuration,
  onDragDurationStart,
  onDragDurationEnd,
  onCreateTimestamp,
}) => {
  const mousePosition = useRef({ x: 0, y: 0 })
  const [dragStartTime, setDragStartTime] = useState(null)
  const [primaryDrag, setPrimaryDrag] = useState(false)
  const [shiftKeyDown, setShiftKeyDown] = useState(false)
  const [middleMouseDown, setMiddleMouseDown] = useState(false)
  const containerRef = useRef()

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Shift") {
        setShiftKeyDown(true)
      }
    }
    const onKeyUp = (e) => {
      if (e.key === "Shift") {
        setShiftKeyDown(false)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [])

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
      const scaleFac = {
        x: matrix.get("a"),
        y: matrix.get("d"),
      }
      onChangeMatrix(
        matrix.translate(delta.x / scaleFac.x, delta.y / scaleFac.y)
      )
    }

    if (primaryDrag) {
      onDragDuration(dragStartTime, projectedMouse.x)
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
    setDragStartTime(projectedMouse.x)
    if (button === 1) {
      setMiddleMouseDown(true)
    } else if (button === 0) {
      onDragDurationStart(projectMouse.x)
      setPrimaryDrag(true)
    }
  })

  const onMouseUp = useEventCallback((e) => {
    const projectedMouse = projectMouse(e)
    if (e.button === 1) {
      setMiddleMouseDown(false)
    } else if (e.button === 0) {
      if (Math.abs(dragStartTime - projectedMouse.x) === 0) {
        onCreateTimestamp(projectedMouse.x)
      }
      setPrimaryDrag(false)
      onDragDurationEnd()
    }
  })

  const onWheel = useEventCallback((e) => {
    const { deltaY } = e
    const scroll = -deltaY / 1000
    const { px, py } = mousePosition.current

    onChangeMatrix(
      matrix
        .translate(px, py)
        .scale(1 + (shiftKeyDown ? 0 : scroll), 1 + (shiftKeyDown ? scroll : 0))
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
      {children}
    </Container>
  )
}

export default MouseTransformHandler
