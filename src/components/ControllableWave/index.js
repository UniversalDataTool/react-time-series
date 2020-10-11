import React, { useEffect } from "react"
import MouseTransformHandler from "../MouseTransformHandler"
import Matrix from "immutable-transform-matrix"
import Wave from "../Wave"
import useEventCallback from "use-event-callback"
import useRafState from "react-use/lib/useRafState"

export const ControllableWave = ({
  curves,
  topLevelMatrix,
  setTopLevelMatrix,
  height,
}) => {
  const [matrix, setMatrix] = useRafState(() => {
    const mat = new Matrix()
    const maxY = Math.max(...curves[0].data.map(([, y]) => y))
    const minY = Math.min(...curves[0].data.map(([, y]) => y))

    return mat
      .scale(1, height)
      .scale(1, 1 / (maxY - minY))
      .translate(0, -minY)
  })

  const onChangeMatrix = useEventCallback((newMatrix) => {
    setMatrix(newMatrix)
    setTopLevelMatrix(
      topLevelMatrix.set("a", newMatrix.get("a")).set("e", newMatrix.get("e"))
    )
  })

  useEffect(() => {
    if (
      topLevelMatrix.get("a") !== matrix.get("a") ||
      topLevelMatrix.get("e") !== matrix.get("e")
    ) {
      setMatrix(
        matrix
          .set("a", topLevelMatrix.get("a"))
          .set("e", topLevelMatrix.get("e"))
      )
    }
  }, [topLevelMatrix, matrix, setMatrix])

  return (
    <MouseTransformHandler matrix={matrix} onChangeMatrix={onChangeMatrix}>
      <Wave
        curves={curves}
        width={500}
        height={height}
        transformMatrix={matrix}
      />
    </MouseTransformHandler>
  )
}

export default ControllableWave
