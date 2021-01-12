import React from "react";
import { styled } from "@material-ui/core/styles";
import useColors from "../../hooks/use-colors";

const Container = styled("div")(({ themecolors }) => ({
  backgroundColor: themecolors.bg,
}));

export const BackgroundContainer = ({ children }) => {
  const themecolors = useColors();
  return <Container themecolors={themecolors}>{children}</Container>;
};

export default BackgroundContainer;
