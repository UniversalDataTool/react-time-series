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
  timestamps,
  selectedTimestampIndex,
  durationGroups,
  selectedDurationGroupIndex,
  selectedDurationIndex,
}) => {
  const themeColors = useColors()
  const [mode, setToolMode] = useToolMode()
  const setTheme = useSetRecoilState(themeAtom)

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

  const selectedTimestamp =
    typeof selectedTimestampIndex === "number"
      ? timestamps[selectedTimestampIndex]
      : null
  const selectedDuration =
    typeof selectedDurationGroupIndex === "number" &&
    typeof selectedDurationIndex === "number"
      ? durationGroups[selectedDurationGroupIndex][selectedDurationIndex]
      : null

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
          <LocationOnIcon style={iconStyle} />
        ) : selectedDuration ? (
          <TimelapseIcon style={iconStyle} />
        ) : null}
      </Box>
      <Box display="block" flexGrow={1} paddingRight={2}>
        <CreatableSelect
          isClearable
          formatCreateLabel={formatCreateLabel}
          styles={selectFieldStyles}
          onChange={console.log}
          options={[{ label: "bird", value: "bird" }]}
        />
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
