import React, { useMemo } from "react"
import { styled } from "@material-ui/core/styles"
import ButtonGroup from "@material-ui/core/ButtonGroup"
import Button from "@material-ui/core/Button"
import useColors from "../../hooks/use-colors"
import CloseIcon from "@material-ui/icons/Close"
import Brightness4Icon from "@material-ui/icons/Brightness4"
import PanToolIcon from "@material-ui/icons/PanTool"
import Box from "@material-ui/core/Box"
import CreateIcon from "@material-ui/icons/Create"
import classnames from "classnames"
import useToolMode from "../../hooks/use-tool-mode"
import useEventCallback from "use-event-callback"
import { useSetRecoilState } from "recoil"
import { themeAtom } from "../../hooks/use-colors"
import CreatableSelect from "react-select/creatable"
import LocationOnIcon from "@material-ui/icons/LocationOn"
import TimelapseIcon from "@material-ui/icons/Timelapse"

const Container = styled("div")(({ themeColors }) => ({
  display: "flex",
  paddingBottom: 16,
  "&&& .MuiButtonBase-root": {
    borderColor: themeColors.fg,
  },
  "&&& .MuiButton-label": {
    color: themeColors.fg,
    textTransform: "none",
  },
  "&&& .active.MuiButtonBase-root": {
    backgroundColor: themeColors.fg,
  },
  "&&& .active .MuiButton-label": {
    color: themeColors.bg,
  },
  "&&& .MuiSvgIcon-root": {
    width: 16,
    height: 16,
  },
}))

const getSelectFieldStyles = (themeColors, timestamp) => ({
  control: (styles) => ({
    ...styles,
    backgroundColor: themeColors.bg,
    borderColor: themeColors.base1,
  }),
  input: (styles) => ({
    ...styles,
    color: themeColors.fg,
  }),
  option: (styles) => ({
    ...styles,
    backgroundColor: themeColors.base02,
    color: themeColors.fg,
  }),
  singleValue: (styles) => ({
    ...styles,
    color: themeColors.fg,
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: themeColors.base02,
  }),
})

const iconStyle = {
  width: 20,
  height: 20,
}

export const Toolbar = ({
  timestamps = [],
  selectedTimestampIndex,
  durationGroups = [],
  selectedDurationGroupIndex,
  selectedDurationIndex,
  onChangeSelectedItemLabel,
}) => {
  const themeColors = useColors()
  const [mode, setToolMode] = useToolMode()
  const setTheme = useSetRecoilState(themeAtom)

  const [labelSet, labelColorMap] = useMemo(() => {
    const labelSet = new Set()
    const labelColorMap = {}
    for (const timestamp of timestamps) {
      if (!timestamp.label) continue
      labelSet.add(timestamp.label)
      labelColorMap[timestamp.label] = timestamp.color
    }
    for (const dg of durationGroups) {
      for (const duration of dg.durations) {
        if (!duration.label) continue
        labelSet.add(duration.label)
        labelColorMap[duration.label] = duration.color || dg.color
      }
      if (!dg.label) continue
      labelSet.add(dg.label)
      labelColorMap[dg.label] = dg.color
    }
    return [labelSet, labelColorMap]
  }, [timestamps, durationGroups])

  const onSelectCreateTool = useEventCallback(() => setToolMode("create"))
  const onSelectPanTool = useEventCallback(() => setToolMode("pan"))
  const onSelectCloseTool = useEventCallback(() => setToolMode("delete"))
  const toggleTheme = useEventCallback(() =>
    setTheme(themeColors.dark ? "light" : "dark")
  )
  const selectFieldStyles = useMemo(
    () => getSelectFieldStyles(themeColors, selectedTimestampIndex),
    [themeColors, selectedTimestampIndex]
  )
  const formatCreateLabel = useEventCallback((s) => `Add "${s}"`)
  const onChangeSelectedLabel = useEventCallback((newValue) => {
    const { label } = newValue || {}
    onChangeSelectedItemLabel({
      label,
      color: labelColorMap[label],
    })
  })
  const creatableSelectOptions = useMemo(
    () => Array.from(labelSet).map((label) => ({ label, value: label })),
    [labelSet]
  )

  const selectedTimestamp =
    typeof selectedTimestampIndex === "number"
      ? timestamps[selectedTimestampIndex]
      : null
  const selectedDuration =
    typeof selectedDurationGroupIndex === "number" &&
    typeof selectedDurationIndex === "number"
      ? durationGroups[selectedDurationGroupIndex][selectedDurationIndex]
      : null

  const selectedItemValue = useMemo(() => {
    const label = selectedTimestamp?.label || selectedDuration?.label
    return { label, value: label }
  }, [selectedTimestamp, selectedDuration])

  return (
    <Container themeColors={themeColors}>
      <Box
        color={themeColors.fg}
        display="flex"
        alignItems="center"
        justifyContent="center"
        paddingRight={1}
      >
        {selectedTimestamp ? (
          <LocationOnIcon
            style={{
              ...iconStyle,
              color: selectedTimestamp.color || themeColors.fg,
            }}
          />
        ) : selectedDuration ? (
          <TimelapseIcon
            style={{
              ...iconStyle,
              color: selectedDuration.color || themeColors.fg,
            }}
          />
        ) : null}
      </Box>
      <Box display="block" flexGrow={1} paddingRight={2}>
        {(selectedTimestamp || selectedDuration) && (
          <CreatableSelect
            isClearable
            value={selectedItemValue}
            formatCreateLabel={formatCreateLabel}
            styles={selectFieldStyles}
            onChange={onChangeSelectedLabel}
            options={creatableSelectOptions}
          />
        )}
      </Box>
      <ButtonGroup size="small">
        <Button
          onClick={onSelectCreateTool}
          className={classnames({ active: mode === "create" })}
        >
          <CreateIcon />
        </Button>
        <Button
          onClick={onSelectPanTool}
          className={classnames({ active: mode === "pan" })}
        >
          <PanToolIcon />
        </Button>
        <Button
          onClick={onSelectCloseTool}
          className={classnames({ active: mode === "delete" })}
        >
          <CloseIcon />
        </Button>
      </ButtonGroup>
      <Box display="flex" paddingLeft={1}>
        <ButtonGroup size="small">
          <Button onClick={toggleTheme}>
            <Brightness4Icon />
          </Button>
        </ButtonGroup>
      </Box>
    </Container>
  )
}

export default Toolbar
