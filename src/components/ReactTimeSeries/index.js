import React, { useState, useMemo } from "react"
import useEventCallback from "use-event-callback"

import MainLayout from "../MainLayout"

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

export const ReactTimeSeries = ({
  corsProxy = defaultCorsProxy,
  interface: iface,
  sample,
  onModifySample,
}) => {
  const {
    timeFormat,
    enabledTools = defaultEnabledTools,
    durationLabels = emptyAr,
    timestampLabels = emptyAr,
    graphs = defaultGraphs,
    allowCustomLabels,
  } = iface
  let { timeData: sampleTimeData, audioUrl, csvUrl, annotation } = sample

  const timeData = useMemo(() => {
    if (sampleTimeData) return sampleTimeData
    // TODO load audioUrl
    // TODO load csvUrl
  }, [sampleTimeData, audioUrl, csvUrl])

  const curveGroups = useMemo(() => {}, [timeData, graphs])

  const [timestamps, setTimestamps] = useState(() => {
    if (!annotation?.timestamps) return []
    // TODO derive timestamps
    return []
  })
  const [durationGroups, setDurationGroups] = useState(() => {
    if (!annotation?.durations) return []
    // TODO derive timestamps
    return []
  })

  const onChangeDurationGroups = useEventCallback(() => {})
  const onChangeTimestamps = useEventCallback(() => {})

  return (
    <MainLayout
      curveGroups={curveGroups}
      timeFormat={timeFormat}
      durationGroups={durationGroups}
      onChangeDurationGroups={onChangeDurationGroups}
      timestamps={timestamps}
      onChangeTimestamps={onChangeTimestamps}
    />
  )
}

export default ReactTimeSeries
