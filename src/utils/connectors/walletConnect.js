import { initializeConnector } from "@web3-react/core"
import { WalletConnect } from "@web3-react/walletconnect"
import networks from "../networks"


let networkConfig = {}
for(let i = 0; i < networks.length; i++) {
    const currentChainId = networks[i].chainId
    const currentRpc = networks[i].rpcUrl
    networkConfig[currentChainId] = currentRpc
}

export const [ walletConnect, hooks ] = initializeConnector((actions) => new WalletConnect({
    actions,
    options: {
        rpc: networkConfig
    }
}))
