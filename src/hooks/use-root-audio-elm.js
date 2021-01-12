import { atom, useRecoilState } from "recoil";

export const rootAudioElmAtom = atom({
  key: "rootAudioElmAtom",
});

export const useRootAudioElm = () => useRecoilState(rootAudioElmAtom);

export default useRootAudioElm;
