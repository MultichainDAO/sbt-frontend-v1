import { ethers, Contract, BigNumber } from "ethers"
import { Web3Provider } from "@ethersproject/providers"

import {multiHonorAbi, idCardAbi} from "./abi"

import { getError } from "./errors"

import {getWeb3, getNetwork} from "./web3Utils"

  
interface Web3 {
    ethersSigner: ethers.providers.JsonRpcSigner
}


const getMultiHonor = (chainId: number, provider: Web3Provider): Contract => {
    const network = getNetwork(chainId)
    
    const multiHonorAddr = network.contracts.multiHonorProxy
    const { ethersSigner } = getWeb3(provider)
    return new Contract(multiHonorAddr, multiHonorAbi, ethersSigner)
}

const getIdNFT = (chainId: number, provider: Web3Provider): Contract => {
    const network = getNetwork(chainId)
    
    const iDCardAddr = network.contracts.idCardProxy
    const { ethersSigner } = getWeb3(provider)
    return new Contract(iDCardAddr, idCardAbi, ethersSigner)
}

const getVePower =  (sbtId: number, chainId: number, provider: Web3Provider) => {
    const multiHonor = getMultiHonor(chainId, provider)
    const vePower = multiHonor.VEPower(sbtId)
    return(vePower)
}

const getVePoint =  (sbtId: number, chainId: number, provider: Web3Provider) => {
    const multiHonor = getMultiHonor(chainId, provider)
    const vePoint = multiHonor.VEPoint(sbtId)
    return(vePoint)
}

const getEventPoint = (sbtId: number, chainId: number, provider: Web3Provider) => {
    const multiHonor = getMultiHonor(chainId, provider)
    const eventPoint = multiHonor.EventPoint(sbtId)
    return(eventPoint)
}

const getPOC =  (sbtId: number, chainId: number, provider: Web3Provider) => {
    const multiHonor = getMultiHonor(chainId, provider)
    const POC = multiHonor.POC(sbtId)
    return(POC)
}

const getTotalPoint =  (sbtId: number, chainId: number, provider: Web3Provider) => {
    const multiHonor = getMultiHonor(chainId, provider)
    const totalPoint = multiHonor.TotalPoint(sbtId)
    return(totalPoint)
}

const getLevel =  (sbtId: number, chainId: number, provider: Web3Provider) => {
    const multiHonor = getMultiHonor(chainId, provider)
    const level = multiHonor.Level(sbtId)
    return(level)
}



export {
    getMultiHonor,
    getVePower,
    getVePoint,
    getPOC,
    getEventPoint,
    getTotalPoint,
    getLevel
}
