import { Address } from "cluster"

interface Network {
  chainId: number,
  name: string,
  explorer: string,
  rpcUrl: string,
  nativeCurrency: {
    name: string,
    symbol: string,
    gasToLeave: number
  },
  contracts: {
    veOracleSender: string,
    proxyAdmin: string,
    idCardLogic: string,
    idCardProxy: string,
    multiHonorLogic: string,
    multiHonorProxy: string,
    pocSemiToken: string,
    veOracleReceiver: string,
    veMULTI: string,
    delegateCheck: string,
    usdcAddr: string,
  }
}

const networks: Network[] = [
  {
    chainId: 1,
    name: "Ethereum Mainnet",
    explorer: "https://etherscan.io/",
    rpcUrl: "https://mainnet.infura.io/v3/",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      gasToLeave: 0.0000001,
    },
    contracts: {
      veOracleSender : "0x5c1F69eC530d69b5271678ACcAF8490F0dE725d3",
      proxyAdmin: "",
      idCardLogic: "",
      idCardProxy: "",
      multiHonorLogic: "",
      multiHonorProxy: "",
      pocSemiToken: "",
      veOracleReceiver: "",
      veMULTI: "0xbbA4115ecB1F811061eCb5A8DC8FcdEE2748ceBa",
      delegateCheck: "",
      usdcAddr: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    }
  },
  {
    chainId: 56,
    name: "BNBChain Mainnet",
    explorer: "https://bscscan.com/",
    rpcUrl: "https://rpc.ankr.com/bsc",
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      gasToLeave: 0.0001,
    },
    contracts: {
      veOracleSender : "0x7c8D2965D9Bf39BE0Bc7258BA59E6b5f2c48f17f",
      proxyAdmin: "",
      idCardLogic: "",
      idCardProxy: "",
      multiHonorLogic: "",
      multiHonorProxy: "",
      pocSemiToken: "",
      veOracleReceiver: "",
      veMULTI: "0x3f6727DefB15996d13b3461DAE0Ba7263CA3CAc5",
      delegateCheck: "",
      usdcAddr: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d"
    }
  },
  {
    chainId: 250,
    name: "Fantom Mainnet",
    explorer: "https://ftmscan.com/",
    rpcUrl: "https://rpc.ftm.tools/",
    nativeCurrency: {
      name: "Fantom",
      symbol: "FTM",
      gasToLeave: 0.001,
    },
    contracts: {
      veOracleSender : "0x70d6B3cFaaBd6c0Eb6b99b80C6540fA754a72c40",
      proxyAdmin: "",
      idCardLogic: "",
      idCardProxy: "",
      multiHonorLogic: "",
      multiHonorProxy: "",
      pocSemiToken: "",
      veOracleReceiver: "",
      veMULTI: "0xE564cBcD78A76fD0Bb716a8e4252DFF06C2e4AE7",
      delegateCheck: "",
      usdcAddr: ""
    }
  },
  {
    chainId: 137,
    name: "Polygon Mainnet",
    explorer: "https://polygonscan.com/",
    rpcUrl: "https://maticnode1.anyswap.exchange",
    nativeCurrency: {
      name: "Matic",
      symbol: "MATIC",
      gasToLeave: 0.05
    },
    contracts: {
      veOracleSender: "",
      proxyAdmin: "0xe7E22Ad06493b97dd86875C7F59f0d71C664c75E",
      idCardLogic: "0xd8485513dd9947aa3287D90Fd3804D3dF52D0Da1",
      idCardProxy: "0x7a02492bAa66B0b8266a6d25Bbd6D8BA169296CC",
      multiHonorLogic: "0xb8B282f45c8578c7772a0d01A7860aC09B95E36a",
      multiHonorProxy: "0xDd98B79b36c77Ee1F23f37B61e58A61cc3D5aceF",
      pocSemiToken: "0x431E70C7d0a5DE55D6B4F7Af9391eDF35B1dBc24",
      veOracleReceiver: "0xf5828ef8879c307153FA9615FF9C4121981a0314",
      veMULTI: "",
      delegateCheck: "0xD0d5332b37294003f3A915753ea15e4E1BB0Dc50",
      usdcAddr: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
    }
  },
  {
      chainId: 1337,
      name: "Local Node",
      explorer: "",
      rpcUrl: "http://localhost:8545/",
      nativeCurrency: {
        name: "Fusion",
        symbol: "FSN",
        gasToLeave: 0.5
      },
      contracts: {
        veOracleSender: "",
        proxyAdmin: "",
        idCardLogic: "",
        idCardProxy: "",
        multiHonorLogic: "",
        multiHonorProxy: "",
        pocSemiToken: "",
        veOracleReceiver: "",
        veMULTI: "",
        delegateCheck: "",
        usdcAddr: ""
      }
  }
]

const nullNetwork: Network = {
  chainId: 0,
  name: "",
  explorer: "",
  rpcUrl: "",
  nativeCurrency: {
    name: "",
    symbol: "",
    gasToLeave: 0
  },
  contracts: {
    veOracleSender: "",
    proxyAdmin: "",
    idCardLogic: "",
    idCardProxy: "",
    multiHonorLogic: "",
    multiHonorProxy: "",
    pocSemiToken: "",
    veOracleReceiver: "",
    veMULTI: "",
    delegateCheck: "",
    usdcAddr: ""
  }
}


export default networks
export { nullNetwork }
export type { Network }
