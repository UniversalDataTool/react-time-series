import React, { useState, useRef, useEffect, useCallback } from "react"
import { styled } from "@material-ui/core/styles"
import useEventCallback from "use-event-callback"
import useToolMode from "../../hooks/use-tool-mode"

const Container = styled("div")({})

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
  const [toolMode] = useToolMode()
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

  const onWheel = useEventCallback((e) => {
    if (e && e.preventDefault) {
      e.preventDefault()
    }
    const { deltaY } = e
    const scroll = -Math.sign(deltaY) / 10
    const { px, py } = mousePosition.current

    onChangeMatrix(
      matrix
        .translate(px, py)
        .scale(1 + (shiftKeyDown ? 0 : scroll), 1 + (shiftKeyDown ? scroll : 0))
        .translate(-px, -py)
    )
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
    if (toolMode === "zoom" && e.button !== 1) return
    const { clientX, clientY, button } = e
    const projectedMouse = projectMouse(e)
    mousePosition.current = {
      x: clientX,
      y: clientY,
      px: projectedMouse.x,
      py: projectedMouse.y,
    }
    setDragStartTime(projectedMouse.x)
    if (toolMode === "pan" || button === 1 || e.button === 2) {
      setMiddleMouseDown(true)
      e.preventDefault()
    } else if (button === 0) {
      onDragDurationStart(projectMouse.x)
      setPrimaryDrag(true)
    }
  })

  const onMouseUp = useEventCallback((e) => {
    if (toolMode === "zoom" && e.button !== 1) {
      if (e.button === 2) {
        onWheel({ ...e, deltaY: 100 })
      } else if (e.button === 0) {
        onWheel({ ...e, deltaY: -100 })
      }
      return
    }
    const projectedMouse = projectMouse(e)
    if (toolMode === "pan" || e.button === 1 || e.button === 2) {
      setMiddleMouseDown(false)
    } else if (e.button === 0) {
      if (Math.abs(dragStartTime - projectedMouse.x) === 0) {
        onCreateTimestamp(projectedMouse.x)
      }
      setPrimaryDrag(false)
      onDragDurationEnd()
    }
  })

  const onContextMenu = useEventCallback((e) => {
    e.preventDefault()
  })

  const containerMountCallback = useCallback((ref) => {
    if (ref === null) {
      containerRef.current.removeEventListener("wheel", onWheel)
    }
    containerRef.current = ref
    ref.addEventListener("wheel", onWheel, { passive: false })
  }, [])

  return (
    <Container
      ref={containerMountCallback}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onContextMenu={onContextMenu}
    >
      {children}
    </Container>
  )
}

export default MouseTransformHandler
