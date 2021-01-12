import { atom, useSetRecoilState, useRecoilValue } from "recoil";

export const timeCursorTimeAtom = atom({
  key: "timeCursorTime",
});

export const useSetTimeCursorTime = () => useSetRecoilState(timeCursorTimeAtom);

export const useTimeCursorTime = () => useRecoilValue(timeCursorTimeAtom);
