import React, { useState } from "react"
import { styled } from "@material-ui/core/styles"
import Matrix from "immutable-transform-matrix"
import useTimeRange from "../../hooks/use-time-range.js"
import ControllableWave from "../ControllableWave"
import useRafState from "react-use/lib/useRafState"
import DurationBox from "../DurationBox"
import useEventCallback from "use-event-callback"
import { setIn } from "seamless-immutable"
import useColors from "../../hooks/use-colors"
import Timeline from "../Timeline"
import getMinorMajorDurationLines from "../../utils/get-minor-major-duration-lines"
import initTopLevelMatrix from "../../utils/init-top-level-matrix"
import Toolbar from "../Toolbar"
import useGetRandomColorUsingHash from "../../hooks/use-get-random-color-using-hash"

const Container = styled("div")(({ themeColors, width }) => ({
  width: width,
  display: "flex",
  flexDirection: "column",
  backgroundColor: themeColors.bg,
  padding: 16,
}))

export const MainLayout = ({
  curveGroups,
  timeFormat,
  durationGroups,
  onChangeDurationGroups,
  timestamps,
  onChangeTimestamps,
}) => {
  const themeColors = useColors()
  const width = 500
  const [activeDurationGroup, setActiveDurationGroup] = useState(0)
  const [draggedDurationIndex, setDraggedDurationIndex] = useState(0)
  const [selectedTimestampIndex, setSelectedTimestampIndex] = useState(0)

  const [topLevelMatrix, setTopLevelMatrix] = useState(() =>
    initTopLevelMatrix({ curveGroups, width })
  )
  const { visibleTimeStart, visibleTimeEnd } = useTimeRange(topLevelMatrix, 500)

  const onDragDuration = useEventCallback((startTime, endTime) => {
    ;[startTime, endTime] =
      startTime < endTime ? [startTime, endTime] : [endTime, startTime]
    onChangeDurationGroups(
      setIn(
        durationGroups,
        [activeDurationGroup, "durations", draggedDurationIndex],
        {
          start: startTime,
          end: endTime,
        }
      )
    )
  })
  const onDragDurationStart = useEventCallback((startTime) => {
    const lastIndex = durationGroups[activeDurationGroup].durations.length
    setDraggedDurationIndex(lastIndex)
    onChangeDurationGroups(
      setIn(durationGroups, [activeDurationGroup, "durations", lastIndex], {
        start: startTime,
        end: startTime,
      })
    )
  })
  const onDragDurationEnd = useEventCallback(() => {
    setDraggedDurationIndex(null)
  })
  const onCreateTimestamp = useEventCallback((time) => {
    onChangeTimestamps(
      timestamps.concat([
        {
          time,
          color: "#f00",
        },
      ])
    )
  })

  const onRemoveDurationBox = useEventCallback((dgi, boxIndex) => {
    const durations = durationGroups[dgi].durations
    onChangeDurationGroups(
      setIn(
        durationGroups,
        [dgi, "durations"],
        [...durations.slice(0, boxIndex), ...durations.slice(boxIndex + 1)]
      )
    )
  })

  const onClickTimestamp = useEventCallback((ts, tsi) => {
    setSelectedTimestampIndex(tsi)
    setDraggedDurationIndex(null)
  })

  const getRandomColorUsingHash = useGetRandomColorUsingHash()
  const onChangeSelectedItemLabel = useEventCallback(({ label, color }) => {
    onChangeTimestamps(
      setIn(timestamps, [selectedTimestampIndex, "label"], label).setIn(
        [selectedTimestampIndex, "color"],
        color || getRandomColorUsingHash(label)
      )
    )
  })

  const gridLineMetrics = getMinorMajorDurationLines(topLevelMatrix, 500)

  return (
    <Container width={width} themeColors={themeColors}>
      <Toolbar
        timestamps={timestamps}
        selectedTimestampIndex={selectedTimestampIndex}
        onChangeSelectedItemLabel={onChangeSelectedItemLabel}
      />
      <Timeline
        timeFormat={timeFormat}
        width={width}
        visibleTimeStart={visibleTimeStart}
        visibleTimeEnd={visibleTimeEnd}
        timestamps={timestamps}
        gridLineMetrics={gridLineMetrics}
        onClickTimestamp={onClickTimestamp}
      />
      {durationGroups.map((dg, i) => {
        return (
          <DurationBox
            onClick={() => setActiveDurationGroup(i)}
            onRemoveBox={(boxIndex) => onRemoveDurationBox(i, boxIndex)}
            key={i}
            active={i === activeDurationGroup}
            color={dg.color}
            width={width}
            label={dg.label}
            durations={dg.durations}
            visibleTimeStart={visibleTimeStart}
            visibleTimeEnd={visibleTimeEnd}
          />
        )
      })}
      {curveGroups.map((curves, i) => (
        <ControllableWave
          key={i}
          durations={durationGroups[activeDurationGroup]}
          onDragDuration={onDragDuration}
          onDragDurationStart={onDragDurationStart}
          onDragDurationEnd={onDragDurationEnd}
          onCreateTimestamp={onCreateTimestamp}
          durationGroups={durationGroups}
          timestamps={timestamps}
          curves={curves}
          width={width}
          height={200}
          gridLineMetrics={gridLineMetrics}
          topLevelMatrix={topLevelMatrix}
          setTopLevelMatrix={setTopLevelMatrix}
        />
      ))}
    </Container>
  )
}

export default MainLayout
