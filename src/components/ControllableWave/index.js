import React, { useState, useEffect } from "react"
import MouseTransformHandler from "../MouseTransformHandler"
import Matrix from "immutable-transform-matrix"
import Wave from "../Wave"
import useEventCallback from "use-event-callback"
import useRafState from "react-use/lib/useRafState"

export const ControllableWave = ({
  curve,
  topLevelMatrix,
  setTopLevelMatrix,
}) => {
  const [matrix, setMatrix] = useRafState(new Matrix())

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
  }, [topLevelMatrix, matrix])

  return (
    <MouseTransformHandler
      initialMatrix={matrix}
      onChangeMatrix={onChangeMatrix}
    >
      <Wave
        curves={[curve]}
        width={500}
        height={200}
        transformMatrix={matrix}
      />
    </MouseTransformHandler>
  )
}

export default ControllableWave
