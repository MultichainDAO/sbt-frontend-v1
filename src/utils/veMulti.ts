import { ethers, Contract, BigNumber } from "ethers"
import { Web3Provider } from "@ethersproject/providers"

import {veMULTIAbi} from "./abi"
import {sbtContract} from "./sbtContract"

import { formatAddr, formatUnits, significantDigits, tsToTime } from "../utils/web2Utils"

import { getError } from "./errors"

import {getWeb3, getNetwork} from "./web3Utils"



const getVeMulti =  (chainId: number, provider: Web3Provider): Contract => {
    const network = getNetwork(chainId)
    
    const veMultiAddr = network.contracts.veMULTI
    const { ethersSigner } = getWeb3(provider)
    return new Contract(veMultiAddr, veMULTIAbi, ethersSigner)
}

const veMultiBalanceOf = async (account: string, chainId: number, provider: Web3Provider) => {
    const veMULTI = getVeMulti(chainId, provider)
    const numberOfVeMulti =  await veMULTI.balanceOf(account)
    return (Number(numberOfVeMulti))
}

const totalLockedMulti = async (veMultiId: number, chainId: number, provider: Web3Provider) => {
    const veMULTI = getVeMulti(chainId, provider)
    const locked = await veMULTI.locked(veMultiId)
    const lockedMulti = formatUnits(locked.amount, 18)
    return(Number(lockedMulti))
}

const veMultiOfOwnerByIndex = async (account: string, index: number, chainId: number, provider: Web3Provider) => {
    const veMULTI = getVeMulti(chainId, provider)
    const veMultiId = await veMULTI.tokenOfOwnerByIndex(account, index)
    return(Number(veMultiId))
}

const lockedEnd = async (veMultiId: number, chainId: number, provider: Web3Provider) => {
    const veMULTI = getVeMulti(chainId, provider)
    const timeEnd = await veMULTI.locked__end(veMultiId)
    return(Number(timeEnd))
}

export {
    getVeMulti,
    veMultiBalanceOf,
    totalLockedMulti,
    veMultiOfOwnerByIndex,
    lockedEnd
}