import React, { useState } from "react"
import { styled } from "@material-ui/core/styles"
import useTimeRange from "../../hooks/use-time-range.js"
import ControllableWave from "../ControllableWave"
import DurationBoxes from "../DurationBoxes"
import useEventCallback from "use-event-callback"
import { setIn, getIn } from "seamless-immutable"
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
}))

export const MainLayout = ({
  curveGroups,
  timeFormat,
  durationGroups,
  onChangeDurationGroups,
  timestampLabels = [],
  durationLabels = [],
  allowCustomLabels,
  timestamps,
  width = 500,
  graphHeight = 300,
  onChangeTimestamps,
}) => {
  const themeColors = useColors()
  const [activeDurationGroup, setActiveDurationGroup] = useState(null)
  const [draggedDurationIndex, setDraggedDurationIndex] = useState(null)
  const [selectedDurationIndex, setSelectedDurationIndex] = useState(null)
  const [selectedTimestampIndex, setSelectedTimestampIndex] = useState(null)

  const [topLevelMatrix, setTopLevelMatrix] = useState(() =>
    initTopLevelMatrix({ curveGroups, width })
  )
  const { visibleTimeStart, visibleTimeEnd } = useTimeRange(
    topLevelMatrix,
    width
  )

  const onDragDuration = useEventCallback((startTime, endTime) => {
    if (activeDurationGroup === null) return
    ;[startTime, endTime] =
      startTime < endTime ? [startTime, endTime] : [endTime, startTime]

    if (selectedDurationIndex !== draggedDurationIndex)
      setSelectedDurationIndex(selectedDurationIndex)

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
    if (activeDurationGroup === null) return
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
    setSelectedDurationIndex(draggedDurationIndex)
    setDraggedDurationIndex(null)
  })
  const onCreateTimestamp = useEventCallback((time) => {
    onChangeTimestamps(
      timestamps.concat([
        {
          time,
          color: "#888",
        },
      ])
    )
    setSelectedTimestampIndex(timestamps.length)
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
    if (selectedTimestampIndex !== null) setSelectedTimestampIndex(null)
    if (selectedDurationIndex !== null) setSelectedDurationIndex(null)
  })

  const onClickTimestamp = useEventCallback((ts, tsi) => {
    setSelectedTimestampIndex(tsi)
    if (selectedDurationIndex !== null) setSelectedDurationIndex(null)
  })

  const getRandomColorUsingHash = useGetRandomColorUsingHash()
  const onChangeSelectedItemLabel = useEventCallback(({ label, color }) => {
    if (selectedTimestampIndex !== null) {
      onChangeTimestamps(
        setIn(timestamps, [selectedTimestampIndex, "label"], label).setIn(
          [selectedTimestampIndex, "color"],
          color || getRandomColorUsingHash(label)
        )
      )
    } else if (selectedDurationIndex !== null) {
      const pathToDuration = [
        activeDurationGroup,
        "durations",
        selectedDurationIndex,
      ]
      onChangeDurationGroups(
        setIn(durationGroups, pathToDuration, {
          ...getIn(durationGroups, pathToDuration),
          label,
          ...(getIn(durationGroups, [activeDurationGroup, "color"])
            ? {}
            : { color: color || getRandomColorUsingHash(label) }),
        })
      )
    }
  })

  const onRemoveTimestamp = useEventCallback((ts, tsi) => {
    onChangeTimestamps([
      ...timestamps.slice(0, tsi),
      ...timestamps.slice(tsi + 1),
    ])
  })

  const gridLineMetrics = getMinorMajorDurationLines(topLevelMatrix, width)

  return (
    <Container width={width} themeColors={themeColors}>
      <Toolbar
        timestamps={timestamps}
        timestampLabels={timestampLabels}
        durationLabels={durationLabels}
        selectedTimestampIndex={selectedTimestampIndex}
        onChangeSelectedItemLabel={onChangeSelectedItemLabel}
        selectedDurationGroupIndex={activeDurationGroup}
        selectedDurationIndex={selectedDurationIndex}
        durationGroups={durationGroups}
        allowCustomLabels={allowCustomLabels}
      />
      <Timeline
        timeFormat={timeFormat}
        width={width}
        visibleTimeStart={visibleTimeStart}
        visibleTimeEnd={visibleTimeEnd}
        timestamps={timestamps}
        gridLineMetrics={gridLineMetrics}
        onClickTimestamp={onClickTimestamp}
        onRemoveTimestamp={onRemoveTimestamp}
      />
      {durationGroups.map((dg, i) => {
        return (
          <DurationBoxes
            onClick={() => setActiveDurationGroup(i)}
            onClickBox={(di) => {
              setSelectedDurationIndex(di)
              setSelectedTimestampIndex(null)
            }}
            onRemoveBox={(boxIndex) => onRemoveDurationBox(i, boxIndex)}
            key={i}
            active={i === activeDurationGroup}
            color={dg.color}
            width={width}
            label={dg.label}
            isMiscLayer={dg.misc}
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
          height={graphHeight}
          gridLineMetrics={gridLineMetrics}
          topLevelMatrix={topLevelMatrix}
          setTopLevelMatrix={setTopLevelMatrix}
          timeFormat={timeFormat}
        />
      ))}
    </Container>
  )
}

export default MainLayout
