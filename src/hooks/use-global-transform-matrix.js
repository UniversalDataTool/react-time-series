import Matrix from "immutable-transform-matrix";
import { atom, useRecoilState } from "recoil";

const matrix = atom({
  key: "globalTransformMatrix",
  default: new Matrix(),
});

export default () => {
  return useRecoilState(matrix);
};
