
import React from "react"
import * as ReactDOMClient from "react-dom/client"
import App from "./App"
import reportWebVitals from "./reportWebVitals"

import { Web3ReactProvider } from "@web3-react/core"

import { metaMask, hooks as metaMaskHooks } from "./utils/connectors/metaMask"
import { walletConnect, hooks as walletConnectHooks } from "./utils/connectors/walletConnect"

const container = document.getElementById("root")
if(!container) throw new Error(`Failed to find the root element.`)
const root = ReactDOMClient.createRoot(container)

root.render(
  <React.StrictMode>
    <Web3ReactProvider connectors={ [ [ metaMask, metaMaskHooks ], [ walletConnect, walletConnectHooks ] ] }>
      <App />
    </Web3ReactProvider>
  </React.StrictMode>
)


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
