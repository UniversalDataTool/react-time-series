import Matrix from "immutable-transform-matrix"

export default ({ curveGroups, width }) => {
  const mat = new Matrix()

  const allTimes = curveGroups
    .flatMap((curveGroup) => curveGroup)
    .flatMap((curve) => curve.data.map(([t]) => t))

  if (allTimes.length === 0) return mat

  const minT = Math.min(...allTimes)
  const maxT = Math.max(...allTimes)

  return mat
    .scale(width, 1)
    .scale(1 / (maxT - minT), 1)
    .translate(-minT, 0)
}
