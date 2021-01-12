import React from "react";
import { RecoilRoot } from "recoil";
import "../src/index.css";
import BackgroundContainer from "../src/components/BackgroundContainer";

export const decorators = [
  (Story) => (
    <RecoilRoot>
      <div
        style={{
          padding: 16,
          backgroundColor: "#282a36",
          minWidth: 600,
          minHeight: 500,
        }}
      >
        <Story />
      </div>
    </RecoilRoot>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};
