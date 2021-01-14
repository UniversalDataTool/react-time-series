import React, { useState } from "react"
import Toolbar from "./"
import useGetRandomColorUsingHash from "../../hooks/use-get-random-color-using-hash"
import { solarized } from "../../hooks/use-colors"

export default {
  title: "Toolbar",
  component: Toolbar,
}

export const Primary = () => {
  const selectedTimestampIndex = 0
  const getRandomColorUsingHash = useGetRandomColorUsingHash()
  const [timestamps, setTimestamps] = useState([
    {
      color: solarized.red,
      time: 100,
      label: "bird",
    },
    {
      color: solarized.blue,
      time: 200,
      label: "mouse",
    },
  ])

  return (
    <Toolbar
      timestamps={timestamps}
      selectedTimestampIndex={selectedTimestampIndex}
      onChangeSelectedItemLabel={({ label, color }) => {
        setTimestamps(
          timestamps.map((ts, i) =>
            i !== selectedTimestampIndex
              ? ts
              : {
                  ...ts,
                  label,
                  color: color ? color : getRandomColorUsingHash(label),
                }
          )
        )
      }}
      onStartPlayback={() => null}
      onStopPlayback={() => null}
      isPlayingMedia={false}
    />
  )
}
