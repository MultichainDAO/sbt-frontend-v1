
import { ethers } from "ethers"
import { Web3Provider } from "@ethersproject/providers"
import { serializeError } from "eth-rpc-errors"



const WEB3_MISSING = (): Error => {
  return new Error(`Web3 Provider Not Detected.`)
}

const UNDEFINED_CHAINID = (): Error => {
  return new Error(`Unknown Chain ID.`)
}

const UNSUPPORTED_CHAIN = (id: number): Error => {
  return new Error(`Unsupported Chain ID: ${ id }`)
}

const FAILED_APPROVAL = (): Error => {
  return new Error(`Approval Transaction Failed.`)
}

const ZERO_BAL = (tokenName: string): Error => {
  return new Error(`Zero Balance of ${ tokenName }.`)
}




const DEFAULT = (): Error => {
  return new Error(`Unknown error occurred.`)
}

const DEFAULT_METAMASK_ERROR = (): string => {
  return `Unknown MetaMask error occurred.`
}


const getMetamaskError = (code: number): string => {
  switch(code) {
    case 4001:
      return `Request rejected.`
    case 4100:
      return `Request rejected.`
    case 4200:
      return `Action not supported by this provider.`
    case 4900:
      return `Provider disconnected.`
    case 4901:
      return `Provider disconnected from chain.`
    case 32700:
      return `Invalid JSON request.`
    case 32600:
      return `Invalid JSON request.`
    case 32601:
      return `This method does not exist.`
    case 32602:
      return `Invaild method parameters.`
    // case 32603:
    //   return `Unknown error occurred. (JSON-RPC Error).`
    case 32000:
      return `Invalid input.`
    case 32001:
      return `Resource not found.`
    case 32002:
      return `Resource not available.`
    case 32003:
      return `Transaction rejected.`
    case 32004:
      return `Method not supported.`
    case 32005:
      return `Request limit exceeded.`
    default:
      return DEFAULT_METAMASK_ERROR()
  }
}



const getError = (provider: Web3Provider, chainId: number, err: Error): Error | string => {
  const serialized = serializeError(err)

  if(serialized.code !== -32603) return "MultiDAO SBT: " + getMetamaskError(serialized.code)

  const originalError: any = serialized.data
  console.log(originalError)
  const errorData: string = originalError.originalError.data

 
  let iface, errorFragment


  console.log(errorData)

  return DEFAULT()
}


export {
  WEB3_MISSING,
  UNDEFINED_CHAINID,
  UNSUPPORTED_CHAIN,
  FAILED_APPROVAL,
  ZERO_BAL,
  getError
}
