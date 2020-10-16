import React from "react"
import { RecoilRoot } from "recoil"
import "../src/index.css"
import BackgroundContainer from "../src/components/BackgroundContainer"

export const decorators = [
  (Story) => (
    <RecoilRoot>
      <div
        style={{
          padding: 16,
          backgroundColor: "#282a36",
          width: "100vw",
          height: "100vh",
        }}
      >
        <Story />
      </div>
    </RecoilRoot>
  ),
]

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}
