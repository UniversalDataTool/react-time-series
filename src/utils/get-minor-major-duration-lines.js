const mins = 1000 * 60
const hours = 60 * mins
const days = 24 * hours
const weeks = 7 * days
const months = 30 * days
const years = 12 * months
const timeIntervals = [
  ["1 ms", 1],
  ["5 ms", 5],
  ["50 ms", 50],
  ["500 ms", 500],
  ["1s", 1000],
  ["10s", 10000],
  ["1 min", mins],
  ["30 min", 30 * mins],
  ["1 hr", hours],
  ["8 hrs", 8 * hours],
  ["1 day", days],
  ["1 week", weeks],
  ["1 month", months],
  ["3 months", months * 3],
  ["1 year", years],
]

export const findReasonableGridDuration = (duration) => {
  let bestFittingIntervalIndex = 0
  let bestFittingIntervalScore = -Infinity
  for (const [i, [, timeInterval]] of Object.entries(timeIntervals)) {
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

  const [
    [majorDurationLabel, majorDuration],
    [minorDurationLabel, minorDuration],
  ] = findReasonableGridDuration(endTimeOnGraph - startTimeOnGraph)

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
    majorDurationLabel,
    minorDuration,
    minorDurationLabel,
    numberOfMajorGridLines,
    numberOfMinorGridLines,
    majorGridLinePixelOffset,
    minorGridLinePixelOffset,
    majorGridLinePixelDistance,
    minorGridLinePixelDistance,
  }
}
