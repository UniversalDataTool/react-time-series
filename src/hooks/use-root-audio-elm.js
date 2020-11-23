import { atom, useRecoilState } from "recoil"

export const rootAudioElmAtom = atom({
  key: "rootAudioElmAtom",
})

export const useRootAudioEle = useRecoilState(rootAudioElmAtom)
