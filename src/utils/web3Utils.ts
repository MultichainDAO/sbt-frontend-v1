
import { ethers, Contract, BigNumber } from "ethers"
import { Web3Provider } from "@ethersproject/providers"
import BigNumberDecimal from "bignumber.js"
import { Connector } from "@web3-react/types"

import { Units, parseUnits, ZERO, ZERO_ADDR, ONE_ETHER, APPROVAL_THRESHOLD, MAX_UINT, formatUnits } from "./web2Utils"

import networks, { Network, nullNetwork } from "./networks"
import { getError } from "./errors"
import { MetaMask } from "@web3-react/metamask"


interface Connection {
  provider: any,
  accounts: string[],
  chainId: number,
  connected: boolean,
  reconnect: (() => void)
}

interface Web3 {
  ethersSigner: ethers.providers.JsonRpcSigner
}

interface GasFees {
  low: BigNumber,
  medium: BigNumber,
  high: BigNumber
}

interface NetAmounts {
  tokenA: BigNumber,
  tokenB: BigNumber
}

interface Status {
  msg: string,
  code: StatusCode,
  tx?: string
}

enum ExactField {
  From,
  To
}
enum StatusCode {
  Fail,
  Warn,
  Success
}

enum WalletListOptions {
  WalletConnect,
  MetaMask
}

const nullConnection: Connection = {
  provider: null,
  accounts: [],
  chainId: 0,
  connected: false,
  reconnect: () => {}
}

// const connectWeb3 = async (provider: any, accounts: string[] | undefined, chainId: number | undefined, reconnect: () => Promise<void>) => {
//   if(provider) {
//     let connected = false
//     // const accounts = await provider.request({ method: "eth_requestAccounts" })
//     // const chainId = Number(await provider.request({ method: "eth_chainId" }))
//     if(!chainId) throw UNDEFINED_CHAINID()
//     if(!chainId || !validChain(chainId)) throw UNSUPPORTED_CHAIN(chainId)
//     connected = true
//     const web3Connection = {
//       provider,
//       accounts,
//       chainId,
//       connected,
//       reconnect
//     }
//     return web3Connection
//   } else {
//     throw WEB3_MISSING()
//   }
// }

const getWeb3 = (provider: Web3Provider): Web3 => {
  const ethersSigner: ethers.providers.JsonRpcSigner = provider.getSigner()
  return { ethersSigner }
}

const getBaseBal = async (provider: Web3Provider, accounts: string[]): Promise<BigNumber> => {
  const balWei = await provider.getBalance(accounts[ 0 ])
  return balWei
}

const getNetwork = (chainId: number|undefined): Network => {
  for(let i = 0; i < networks.length; i++) {
    if(networks[ i ].chainId === chainId) return networks[ i ]
  }
  return nullNetwork
}

const deductGasFee = (chainId: number, tokenAddr: string, amount: BigNumber): BigNumber => {
  if(tokenAddr === ZERO_ADDR) {
    const { nativeCurrency } = getNetwork(chainId)
    const gasToLeave = parseUnits(String(nativeCurrency.gasToLeave), Units.ether)
    return amount.sub(gasToLeave)
  } else {
    return amount
  }
}

const getGasFees = async (provider: Web3Provider): Promise<GasFees> => {
  const gasPrice = await provider.getGasPrice()
  const lowGasPrice = gasPrice.div(2)
  const highGasPrice = gasPrice.mul(2)
  return { low: lowGasPrice, medium: gasPrice, high: highGasPrice }
}


const amountToWeiDecimals = (amount: BigNumber, decimals: number): BigNumber => {
  const difference = 10 ** (18 - decimals)
  return amount.mul(difference)
}

export {
  nullConnection,
  nullNetwork,
  ZERO,
  ExactField,
  StatusCode,
  WalletListOptions,
  getWeb3,
  getBaseBal,
  getNetwork,
  getGasFees,
  deductGasFee,
}

export type { Connection, GasFees, NetAmounts, Status }
