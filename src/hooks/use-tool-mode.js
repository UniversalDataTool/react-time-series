import { atom, useRecoilState } from "recoil"

export const atomToolMode = atom({
  key: "toolMode",
  default: "create",
})

export default () => useRecoilState(atomToolMode)
