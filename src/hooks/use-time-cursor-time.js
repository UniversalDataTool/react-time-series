import { atom, useSetRecoilState, useRecoilValue } from "recoil"

export const timeCursorTimeAtom = atom({
  key: "timeCursorTime",
  default: 0,
})

export const useSetTimeCursorTime = () => useSetRecoilState(timeCursorTimeAtom)

export const useTimeCursorTime = () => useRecoilValue(timeCursorTimeAtom)
