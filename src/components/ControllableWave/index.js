import React from "react"
import MouseTransformHandler from "../MouseTransformHandler"
import Matrix from "immutable-transform-matrix"
import Wave from "../Wave"
import useEventCallback from "use-event-callback"
import useRafState from "react-use/lib/useRafState"

export const ControllableWave = ({
  curves,
  topLevelMatrix,
  setTopLevelMatrix,
  width,
  height,
  onDragDuration,
  onDragDurationStart,
  onDragDurationEnd,
  onCreateTimestamp,
  durationGroups,
  timestamps,
  gridLineMetrics,
  timeFormat,
  showValues,
}) => {
  let [matrix, setMatrix] = useRafState(() => {
    const mat = new Matrix()
    const maxY = Math.max(...curves[0].data.map(([, y]) => y))
    const minY = Math.min(...curves[0].data.map(([, y]) => y))

    return mat
      .scale(1, -1)
      .scale(1, height)
      .scale(1, 1 / (maxY - minY))
      .translate(0, -maxY)
  })

  matrix = matrix
    .set("a", topLevelMatrix.get("a"))
    .set("e", topLevelMatrix.get("e"))

  const onChangeMatrix = useEventCallback((newMatrix) => {
    setMatrix(newMatrix)
    setTopLevelMatrix(
      topLevelMatrix.set("a", newMatrix.get("a")).set("e", newMatrix.get("e"))
    )
  })

  return (
    <MouseTransformHandler
      matrix={matrix}
      onChangeMatrix={onChangeMatrix}
      onDragDuration={onDragDuration}
      onDragDurationStart={onDragDurationStart}
      onDragDurationEnd={onDragDurationEnd}
      onCreateTimestamp={onCreateTimestamp}
    >
      <Wave
        curves={curves}
        width={width}
        height={height}
        timeFormat={timeFormat}
        transformMatrix={matrix}
        gridLineMetrics={gridLineMetrics}
        timestamps={timestamps}
        durationGroups={durationGroups}
        showValues={showValues}
      />
    </MouseTransformHandler>
  )
}

export default ControllableWave
