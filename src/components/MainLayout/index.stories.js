import React, { useState } from "react"

import MainLayout from "./"
import tesla from "./tesla.json"
import { solarized } from "../../hooks/use-colors"

export default {
  title: "MainLayout",
  component: MainLayout,
  argTypes: {},
}

export const Primary = () => {
  const [durationGroups, setDurationGroups] = useState([
    {
      label: "buy here",
      color: solarized.cyan,
      durations: [
        {
          start: 1537416000000,
          end: 1539316800000,
        },
      ],
    },
    {
      label: "sell here",
      color: solarized.magenta,
      durations: [],
    },
  ])

  const [timestamps, setTimestamps] = useState([
    {
      color: solarized.red,
      time: 1520398800000,
    },
  ])

  return (
    <MainLayout
      timeFormat="dates"
      curveGroups={[
        [
          { data: tesla.curve2018, color: solarized.yellow },
          { data: tesla.curve2017, color: solarized.blue },
        ],
        [
          {
            data: tesla.curve2017
              .concat(tesla.curve2018)
              .filter((_, i) => i % 10 === 0)
              .sort((a, b) => a[0] - b[0]),
            color: solarized.green,
          },
        ],
      ]}
      durationGroups={durationGroups}
      timestamps={timestamps}
      onChangeTimestamps={setTimestamps}
      onChangeDurationGroups={setDurationGroups}
    />
  )
}

export const ExampleMiscLayer = () => {
  const [durationGroups, setDurationGroups] = useState([
    {
      color: solarized.cyan,
      durations: [
        {
          start: 1537416000000 - 1000 * 60 * 60 * 24 * 40,
          end: 1539316800000 - 1000 * 60 * 60 * 24 * 40,
          label: "one",
        },
        {
          start: 1537416000000,
          end: 1539316800000,
          label: "two",
        },
      ],
    },
  ])
  return (
    <MainLayout
      timeFormat="dates"
      curveGroups={[[{ data: tesla.curve2018, color: solarized.yellow }]]}
      timestamps={[]}
      durationGroups={durationGroups}
      onChangeTimestamps={() => null}
      onChangeDurationGroups={(newDurationGroups) => {
        setDurationGroups(newDurationGroups)
      }}
    />
  )
}

export const AudioPlayback = () => {
  const [durationGroups, setDurationGroups] = useState([])

  const [timestamps, setTimestamps] = useState([])

  const [isPlayingMedia, setIsPlayingMedia] = useState(false)

  return (
    <MainLayout
      timeFormat="dates"
      curveGroups={[
        [
          {
            data: tesla.curve2017.sort((a, b) => a[0] - b[0]),
            color: solarized.green,
          },
        ],
      ]}
      durationGroups={durationGroups}
      timestamps={timestamps}
      onChangeTimestamps={setTimestamps}
      onChangeDurationGroups={setDurationGroups}
      onStartPlayback={() => setIsPlayingMedia(true)}
      onStopPlayback={() => setIsPlayingMedia(false)}
      isPlayingMedia={isPlayingMedia}
    />
  )
}
