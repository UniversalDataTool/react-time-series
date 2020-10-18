const mins = 1000 * 60
const hours = 60 * mins
const days = 24 * hours
const weeks = 7 * days
const months = 30 * days
const years = 12 * months
const timeIntervals = [
  1,
  5,
  50,
  500,
  1000,
  10000,
  mins,
  30 * mins,
  hours,
  8 * hours,
  days,
  weeks,
  months,
  months * 3,
  years,
]

const findReasonableGridDuration = (duration) => {
  let bestFittingIntervalIndex = 0
  let bestFittingIntervalScore = -Infinity
  for (const [i, timeInterval] of Object.entries(timeIntervals)) {
    const timeIntervalScore = -1 * Math.abs(duration / timeInterval - 20)
    if (timeIntervalScore > bestFittingIntervalScore) {
      bestFittingIntervalIndex = i
      bestFittingIntervalScore = timeIntervalScore
    }
  }
  return [
    timeIntervals[bestFittingIntervalIndex],
    timeIntervals[bestFittingIntervalIndex - 1],
  ]
}

export default (transformMatrix, graphWidth) => {
  const { x: startTimeOnGraph } = transformMatrix.inverse().applyToPoint(0, 0)
  const { x: endTimeOnGraph } = transformMatrix
    .inverse()
    .applyToPoint(graphWidth, 0)

  const [majorDuration, minorDuration] = findReasonableGridDuration(
    endTimeOnGraph - startTimeOnGraph
  )

  const numberOfMajorGridLines = Math.ceil(
    (endTimeOnGraph - startTimeOnGraph) / majorDuration
  )

  const numberOfMinorGridLines = Math.ceil(
    (endTimeOnGraph - startTimeOnGraph) / minorDuration
  )

  const majorGridLineStartTime =
    Math.floor(startTimeOnGraph / majorDuration) * majorDuration
  const minorGridLineStartTime =
    Math.floor(startTimeOnGraph / minorDuration) * minorDuration

  const majorGridLinePixelOffset = transformMatrix.applyToPoint(
    majorGridLineStartTime,
    0
  ).x
  const minorGridLinePixelOffset = transformMatrix.applyToPoint(
    minorGridLineStartTime,
    0
  ).x

  const majorGridLinePixelDistance =
    transformMatrix.applyToPoint(majorDuration, 0).x -
    transformMatrix.applyToPoint(0, 0).x

  const minorGridLinePixelDistance =
    transformMatrix.applyToPoint(minorDuration, 0).x -
    transformMatrix.applyToPoint(0, 0).x

  return {
    startTimeOnGraph,
    endTimeOnGraph,
    majorDuration,
    minorDuration,
    numberOfMajorGridLines,
    numberOfMinorGridLines,
    majorGridLinePixelOffset,
    minorGridLinePixelOffset,
    majorGridLinePixelDistance,
    minorGridLinePixelDistance,
  }
}
