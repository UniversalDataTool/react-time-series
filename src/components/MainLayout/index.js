import React, { useState } from "react"
import TimelineTimes from "../TimelineTimes"
import { styled } from "@material-ui/core/styles"
import range from "lodash/range"
import Matrix from "immutable-transform-matrix"
import useTimeRange from "../../hooks/use-time-range.js"
import ControllableWave from "../ControllableWave"
import useRafState from "react-use/lib/useRafState"
import DurationBox from "../DurationBox"
import useEventCallback from "use-event-callback"
import { setIn } from "seamless-immutable"

const Container = styled("div")({
  width: "80vw",
  height: "80vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#ddd",
})

export const MainLayout = ({
  curveGroups,
  timeFormat,
  durationGroups,
  onChangeDurationGroups,
  timestamps,
  onChangeTimestamps,
}) => {
  const width = 500
  const [activeDurationGroup, setActiveDurationGroup] = useState(0)
  const [draggedDurationIndex, setDraggedDurationIndex] = useState(0)

  const [topLevelMatrix, setTopLevelMatrix] = useRafState(() => {
    const mat = new Matrix()

    const allTimes = curveGroups
      .flatMap((curveGroup) => curveGroup)
      .flatMap((curve) => curve.data.map(([t]) => t))
    const minT = Math.min(...allTimes)
    const maxT = Math.max(...allTimes)

    return mat
      .scale(width, 1)
      .scale(1 / (maxT - minT), 1)
      .translate(-minT, 0)
  })
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

  return (
    <Container>
      <TimelineTimes
        timeFormat={timeFormat}
        width={width}
        visibleTimeStart={visibleTimeStart}
        visibleTimeEnd={visibleTimeEnd}
        timestamps={timestamps}
      />
      {durationGroups.map((dg, i) => {
        return (
          <DurationBox
            onClick={() => setActiveDurationGroup(i)}
            key={i}
            active={i === activeDurationGroup}
            color={dg.color}
            width={width}
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
          topLevelMatrix={topLevelMatrix}
          setTopLevelMatrix={setTopLevelMatrix}
        />
      ))}
    </Container>
  )
}

export default MainLayout
