import React from "react";
import { styled } from "@material-ui/core/styles";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Color from "color";
import useEventCallback from "use-event-callback";
import useToolMode from "../../hooks/use-tool-mode";

export const Container = styled("div")(({ left, color, hasIcon }) => ({
  position: "absolute",
  bottom: 2,
  fontSize: 14,
  fontWeight: 600,
  whiteSpace: "pre",
  ...(hasIcon
    ? {
        left: left - 14,
        bottom: -8,
        padding: 4,
      }
    : {
        borderLeft: `1px solid ${color}`,
        left: left,
        padding: 4,
        paddingLeft: 6,
        paddingRight: 6,
        backgroundColor: Color(color).darken(0.5).fade(0.2).string(),
      }),
  color: "#fff",
  cursor: "pointer",
  "&:hover": hasIcon
    ? {
        backgroundColor: Color(color).fade(0.5).string(),
      }
    : {
        backgroundColor: Color(color).darken(0.6).string(),
      },
  "& .icon": {
    color: color,
    width: 20,
    height: 20,
  },
  "& .stem": hasIcon
    ? {}
    : {
        position: "absolute",
        left: -1,
        bottom: -2,
        width: 1,
        height: 2,
        backgroundColor: color,
      },
}));

export const TimeStamp = ({ left, color, label, onClick, onRemove }) => {
  const [toolMode] = useToolMode();
  const onMouseUp = useEventCallback((e) => {
    if (toolMode === "delete" || e.button === 2 || e.button === 1) {
      onRemove();
    }
  });
  const onContextMenu = useEventCallback((e) => {
    e.preventDefault();
  });
  return (
    <Container
      onClick={onClick}
      onMouseUp={onMouseUp}
      onContextMenu={onContextMenu}
      left={left}
      color={color}
      hasIcon={!label}
    >
      <div className="stem" />
      {label ? <span>{label}</span> : <LocationOnIcon className="icon" />}
    </Container>
  );
};

export default TimeStamp;
