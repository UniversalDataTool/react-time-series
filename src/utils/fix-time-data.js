export default (timeData, graphs) => {
  // Make sure that all points have time, and time is always a number
  for (const sample of timeData) {
    if (sample.time === undefined || sample.time === null)
      throw new Error(`Undefined time for sample\n\n${JSON.stringify(sample)}`)
    if (typeof sample.time === "string") {
      const ogTime = sample.time
      if (isNaN(ogTime)) {
        sample.time = new Date(sample.time).valueOf()
      } else {
        sample.time = parseFloat(sample.time)
      }
      if (isNaN(sample.time)) {
        throw new Error(`Couldn't parse time "${sample.time}"`)
      }
    }
    if (isNaN(sample.time)) throw new Error("Time must be a number")
  }

  // Make sure that timeData has a value in each datapoint for
  // each graph (or explicitly doesn't define it w/ undefined)
  // No NaNs allowed
  for (const graph of graphs) {
    let pointsDefined = 0

    for (const sample of timeData) {
      const v = sample[graph.keyName]
      if (v !== undefined && v !== null && isNaN(v))
        throw new Error(`Bad value for "${graph.keyName}": "${v}"`)
      pointsDefined++
    }

    if (pointsDefined < 2)
      throw new Error(
        `Less than two points defined for the "${graph.keyName}" graph`
      )
  }

  return timeData
}
