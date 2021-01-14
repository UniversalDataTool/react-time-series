import { atom, useRecoilValue } from "recoil"

export const themeAtom = atom({
  key: "themeAtom",
  default: "dark",
})

export const solarized = {
  base03: "#002b36",
  base02: "#073642",
  base01: "#586e75",
  base00: "#657b83",
  base0: "#839496",
  base1: "#93a1a1",
  base2: "#eee8d5",
  base3: "#fdf6e3",
  yellow: "#b58900",
  orange: "#cb4b16",
  red: "#dc322f",
  magenta: "#d33682",
  violet: "#6c71c4",
  blue: "#268bd2",
  cyan: "#2aa198",
  green: "#859900",
  dark: true,
}
solarized.fg = solarized.base3
solarized.bg = solarized.base03

const invertedSolarized = {
  ...solarized,
  bg: solarized.fg,
  fg: solarized.bg,
  base03: solarized.base3,
  base02: solarized.base2,
  base01: solarized.base1,
  base00: solarized.base0,
  base0: solarized.base00,
  base1: solarized.base01,
  base2: solarized.base02,
  base3: solarized.base03,
  dark: false,
}

// Current Line -> base02
const dracula = {
  ...solarized,
  base03: "#282a36",
  base02: "#44475a",
  base2: "#f8f8f2",
  // base01: "#",
  // base00: "#",
  // base0: "#",
  // base1: "#",
  // base3: "#",
  cyan: "#8be9fd",
  green: "#50fa7b",
  orange: "#ffb86c",
  magenta: "#ff79c6",
  purple: "#bd93f9",
  red: "#ff5555",
  yellow: "#f1fa8c",
  dark: true,
}
dracula.fg = dracula.base2
dracula.bg = dracula.base03
//
// export const draculaTheme = {
//   bg: "#282a36",
//   "Current Line": "#44475a",
//   Selection: "#44475a",
//   fg: "#f8f8f2",
//   Comment: "#6272a4",
//   Cyan: "#8be9fd",
//   Green: "#50fa7b",
//   Orange: "#ffb86c",
//   Pink: "#ff79c6",
//   Purple: "#bd93f9",
//   Red: "#ff5555",
//   Yellow: "#f1fa8c",
// }

export default () => {
  const themeName = useRecoilValue(themeAtom)
  // TODO switch between light and dark theme
  // Dracula
  return themeName === "dark" ? dracula : invertedSolarized
}
