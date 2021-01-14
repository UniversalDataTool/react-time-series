import Papa from "papaparse"

const possibleTimeHeaders = ["time", "date", "t"]

export default async (csvUrl) => {
  const csvText = await fetch(csvUrl).then((res) => res.text())

  const parseResult = Papa.parse(csvText, { header: true })

  const header = parseResult.meta.fields

  if (!possibleTimeHeaders.some((columnName) => header.includes(columnName))) {
    throw new Error(
      `No time fields in header. Acceptable fields: ${possibleTimeHeaders.join(
        ","
      )}`
    )
  }

  if (!header.includes("time")) {
    for (const row of parseResult.data) {
      row.time = row.date || row.t
    }
  }

  for (const row of parseResult.data) {
    row.time = new Date(row.time).valueOf()
  }

  return parseResult.data
}
