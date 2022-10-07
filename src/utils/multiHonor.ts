import { ethers, Contract, BigNumber } from "ethers"
import { Web3Provider } from "@ethersproject/providers"

import {multiHonorAbi, idCardAbi, oracleSenderAbi} from "./abi"
import {sbtContract} from "./sbtContract"

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

const getSBT = (provider: Web3Provider) : Contract => {
    return new Contract(sbtContract.address, sbtContract.abi, provider)
}

const getIdNFT = (chainId: number, provider: Web3Provider): Contract => {
    const network = getNetwork(chainId)
    
    const iDCardAddr = network.contracts.idCardProxy
    const { ethersSigner } = getWeb3(provider)
    return new Contract(iDCardAddr, idCardAbi, ethersSigner)
}


const getCurrentEpoch = async (chainId: number, provider: Web3Provider) => {
    const multiHonor = getMultiHonor(chainId, provider)
    const currentEpoch = await multiHonor.currentVEEpoch()
    return(Number(currentEpoch))
}

const createSBT = async (chainId: number, provider: Web3Provider) => {
    const idNFT = getIdNFT(chainId, provider)
    console.log(idNFT)
    try {
        const tx = await idNFT.claim()
        await tx.wait()
    }catch(err: any) {
        console.log(err.message)
    }
}

const removeSBT = async (id: number, chainId: number, provider: Web3Provider) => {
    const idNFT = getIdNFT(chainId, provider)
    try {
        const tx = await idNFT.burn(id, {gasLimit: 100000})
        await tx.wait()
    }catch(err: any) {
        console.log(err.message)
    }
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



const getOracleSender = (chainId: number, provider: Web3Provider): Contract => {
    const network = getNetwork(chainId)
    const oracleSenderAddr = network.contracts.veOracleSender
    const { ethersSigner } = getWeb3(provider)
    return new Contract(oracleSenderAddr, oracleSenderAbi, ethersSigner)
}

const delegateVeMultiToSBT = async (veId: number, daoId: number, chainId: number, provider: Web3Provider) => {
    const oracleSender = getOracleSender(chainId, provider)
    try {
        const tx = await oracleSender.delegateVEPower(veId, daoId)
        await tx.wait()
    } catch(err: any) {
        console.log(err.message)
    }
}

const findRewards = async (sbtId: number, chainId: number, provider: Web3Provider) => {
    return(0)
}


const getRewards = async (sbtId: number, chainId: number, provider: Web3Provider) => {

}


export {
    getMultiHonor,
    getCurrentEpoch,
    getIdNFT,
    getSBT,
    createSBT,
    removeSBT,
    getVePower,
    getVePoint,
    getPOC,
    getEventPoint,
    getTotalPoint,
    getLevel,
    delegateVeMultiToSBT,
    findRewards,
    getRewards
}
