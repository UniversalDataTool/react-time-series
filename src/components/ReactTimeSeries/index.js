import React, { useMemo, useState } from "react"
import { setIn } from "seamless-immutable"
import useEventCallback from "use-event-callback"
import { useAsyncMemo } from "use-async-memo"
import { RecoilRoot } from "recoil"
import useGetRandomColorUsingHash from "../../hooks/use-get-random-color-using-hash"
import Measure from "react-measure"

import MainLayout from "../MainLayout"

import fetchAudioData from "../../utils/fetch-audio-data"
import fetchCSVData from "../../utils/fetch-csv-data"

import fixTimeData from "../../utils/fix-time-data"

const emptyAr = []

// This is a cloudflare CORs proxy from the project maintainer @seveibar
const defaultCorsProxy =
  "https://corsproxy.seve.workers.dev/corsproxy/?apiurl={URL}"

const defaultEnabledTools = [
  "create-durations",
  "create-timestamps",
  "label-durations",
  "label-timestamps",
]
const defaultGraphs = [{ keyName: "value" }]

export const ReactTimeSeriesWithoutContext = ({
  // eslint-disable-next-line
  corsProxy = defaultCorsProxy,
  interface: iface,
  sample,
  width: widthProp,
  onModifySample,
}) => {
  if (!iface) throw new Error(`"interface" is a required prop`)
  if (!sample) throw new Error(`"sample" is a required prop`)
  const getRandomColorUsingHash = useGetRandomColorUsingHash()
  let {
    timeFormat,
    enabledTools = defaultEnabledTools,
    durationLabels = emptyAr,
    timestampLabels = emptyAr,
    graphs = defaultGraphs,
    allowCustomLabels,
    showValues,
  } = iface
  let { timeData: sampleTimeData, audioUrl, csvUrl, annotation } = sample
  if (showValues === undefined && !audioUrl) showValues = true

  const timeDataAvailable = [sampleTimeData, audioUrl, csvUrl].some(Boolean)

  const [error, setError] = useState(null)
  const timeData = useAsyncMemo(
    async () => {
      try {
        if (sampleTimeData) return fixTimeData(sampleTimeData, graphs)
        if (audioUrl) return fixTimeData(await fetchAudioData(audioUrl), graphs)
        if (csvUrl) return fixTimeData(await fetchCSVData(csvUrl), graphs)
        throw new Error(
          `No timeData, no audioUrl, no csvUrl, no time data provided.`
        )
      } catch (e) {
        setError(e)
        return []
      }
    },
    [sampleTimeData, audioUrl, csvUrl],
    null
  )

  const timeDataLoading = !timeData && timeDataAvailable

  const curveGroups = useMemo(() => {
    if (!timeData) return []
    const anonRows = []
    const namedRows = {}
    for (const graph of graphs) {
      const curveData = timeData
        .filter(
          (a) => a[graph.keyName] !== undefined && a[graph.keyName] !== null
        )
        .map((a) => [a.time, a[graph.keyName]])
      if (graph.row === undefined || graph.row === null) {
        const curveGroup = [
          {
            data: curveData,
            color: graph.color || getRandomColorUsingHash(graph.keyName),
          },
        ]
        anonRows.push(curveGroup)
      } else {
        if (!namedRows[graph.row]) {
          namedRows[graph.row] = []
        }
        namedRows[graph.row].push({
          data: curveData,
          color: graph.color || getRandomColorUsingHash(graph.keyName),
        })
      }
    }
    return anonRows.concat(
      Object.entries(namedRows).sort((a, b) => a[0].localeCompare(b[0]))
    )
  }, [timeData, graphs, getRandomColorUsingHash])

  const timestamps = useMemo(() => {
    if (!annotation?.timestamps) return []
    return annotation?.timestamps.map((ts) => ({
      time: ts.time,
      label: ts.label,
      color: ts.color || getRandomColorUsingHash(ts.label),
    }))
    // eslint-disable-next-line
  }, [annotation?.timestamps, getRandomColorUsingHash])

  const durationGroups = useMemo(() => {
    if (!annotation?.durations)
      return !enabledTools.includes("create-durations")
        ? []
        : [
            {
              color: "#888888",
              misc: true,
              durations: [],
            },
          ]

    const availableLabels = Array.from(
      new Set(
        annotation.durations.flatMap((d) => [d.label, d.layer]).filter(Boolean)
      )
    )
    availableLabels.sort()

    // TODO no more than 5 layers, after 5 layers start reusing layers

    let durationGroups = availableLabels
      .map((label) => {
        return {
          label,
          color: getRandomColorUsingHash(label),
          durations: annotation.durations
            .filter((d) => d.label === label)
            .map((d) => ({
              start: d.start,
              end: d.end,
              label: d.label,
            })),
        }
      })
      .filter((dg) => dg.durations.length > 0)

    if (enabledTools.includes("create-durations")) {
      durationGroups.push({
        color: "#888888",
        misc: true,
        durations: durationGroups
          .filter((dg) => dg.durations.length === 1)
          .flatMap((dg) => dg.durations)
          .concat(annotation.durations.filter((d) => !d.label))
          .map((d) => ({ ...d, color: getRandomColorUsingHash(d.label) })),
      })
    }

    durationGroups = durationGroups.filter(
      (dg) => dg.misc || dg.durations.length > 1
    )

    return durationGroups
    // eslint-disable-next-line
  }, [annotation?.durations])

  const onChangeDurationGroups = useEventCallback((newDurationGroups) => {
    onModifySample(
      setIn(
        sample,
        ["annotation", "durations"],
        newDurationGroups.flatMap((dg) =>
          dg.durations.map((d) => ({
            ...(d.label && dg.label !== d.label ? {} : { label: dg.label }),
            ...d,
          }))
        )
      )
    )
  })
  const onChangeTimestamps = useEventCallback((newTimestamps) => {
    onModifySample(setIn(sample, ["annotation", "timestamps"], newTimestamps))
  })
  const [width, setWidth] = useState(widthProp)
  const onResize = useEventCallback(({ bounds }) => {
    if (!widthProp) setWidth(bounds.width)
  })

  if (timeDataLoading) return "loading" // TODO real loader

  if (!timeData) {
    throw new Error(
      `No time data provided. Try sample={{timeData: [{time: 0, value: 1}, ...]}} or sample={{audioUrl:"https://..."}}`
    )
  }

  if (curveGroups.length === 0) {
    throw new Error(`For some reason, no curves are able to be displayed.`)
  }

  if (error) {
    throw error
  }

  return (
    <Measure bounds onResize={onResize}>
      {({ measureRef }) => (
        <div ref={measureRef}>
          <MainLayout
            width={width}
            curveGroups={curveGroups}
            timeFormat={timeFormat}
            durationGroups={durationGroups}
            onChangeDurationGroups={onChangeDurationGroups}
            timestamps={timestamps}
            onChangeTimestamps={onChangeTimestamps}
            timestampLabels={timestampLabels}
            durationLabels={durationLabels}
            allowCustomLabels={allowCustomLabels}
            enabledTools={enabledTools}
            showValues={showValues}
          />
        </div>
      )}
    </Measure>
  )
}

export const ReactTimeSeries = (props) => {
  return (
    <RecoilRoot>
      <ReactTimeSeriesWithoutContext {...props} />
    </RecoilRoot>
  )
}

export default ReactTimeSeries
