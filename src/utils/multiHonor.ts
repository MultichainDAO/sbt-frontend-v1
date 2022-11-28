import { ethers, Contract, BigNumber } from "ethers"
import { Web3Provider } from "@ethersproject/providers"

import {multiHonorAbi, idCardAbi, oracleSenderAbi} from "./abi"
import {sbtContract, delegatedVEQuerierContract} from "./sbtContract"

import { getError } from "./errors"

import {getWeb3, getNetwork} from "./web3Utils"

import axios from "axios"
import keccak256 from 'keccak256'


const getMultiHonor = (chainId: number, provider: Web3Provider): Contract => {
    const network = getNetwork(chainId)
    
    const multiHonorAddr = network.contracts.multiHonorProxy
    const { ethersSigner } = getWeb3(provider)
    return new Contract(multiHonorAddr, multiHonorAbi, ethersSigner)
}

const getSbt = (chainId: number, provider: Web3Provider) : Contract => {
    const network = getNetwork(chainId)
    const sbtAddr = network.contracts.idCardProxy
    return new Contract(sbtAddr, sbtContract.abi, provider)
}

const checkSbtExists = async (account: string, chainId: number, sbtNetwork: [number, number], provider: Web3Provider) => {
    if (chainId && sbtNetwork.includes(chainId) && provider) {
        const sbt = getSbt(chainId, provider)
        const bal = await sbt.balanceOf(account)
        if (bal > 0) return(true)
        else return(false)
    }
    return(false)
}

const checkSbtOwned = async (account: string, sbtId: number, chainId: number, provider: Web3Provider) => {
    if (chainId && provider) {
        const sbt = getIdNFT(chainId, provider)
        const owner = await sbt.ownerOf(sbtId)
        if (owner === account) return(true)
        else return(false)
    }
    return(false)
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

const getCurrentEpochXChain = async (targetChainId: number) => {

    
    const network = getNetwork(targetChainId)

    var headers = {
        'Content-Type': 'application/json'
    }

    const func = '0x' + keccak256("currentVEEpoch()").toString('hex').slice(0,8)

    let calldata = func

    const dataString = '{"method":"eth_call","params":[{"to":"' + String(network.contracts.multiHonorProxy) + '","data":"' + calldata + '"},"latest"],"id":1,"jsonrpc":"2.0"}'

    const options = {
        url: network.rpcUrl,
        method: 'POST',
        headers: headers,
        data: dataString
    }

    try {
        const response = await axios(options)
        const data = await response.data
        const epoch = parseInt(data.result, 16)
        return(epoch)
    } catch(error: any) {
        console.log(`Error getting currentEpoch ${targetChainId} : ${error}`)
        return(0)
    }
}


const getSBTTokenId = async (account:string, chainId: number, provider: Web3Provider) => {
    if (chainId && provider) {
        const sbt = getSbt(chainId, provider)
        const tokenId = await sbt.tokenOfOwnerByIndex(account, 0)
        return(tokenId)
    }
    return(null)
}

const removeSBT = async (id: number, chainId: number, provider: Web3Provider) => {
    const idNFT = getIdNFT(chainId, provider)
    try {
        const tx = await idNFT.burn(id, {gasLimit: 300000})
        await tx.wait()
    }catch(err: any) {
        console.log(err.message)
    }
}

const isVeMultiDelegated = async (veId: number, veChainId: number, provider: Web3Provider) => {
    // only on same chain. Use isVeDelegatedXChain for checking across chains
    
    const querierAddr = delegatedVEQuerierContract.address
    const querierAbi = delegatedVEQuerierContract.abi

    const querier = new Contract(querierAddr, querierAbi, provider)

    const isDelegated = await querier.isDelegated(veId, veChainId)

    return(isDelegated)
}


const getVePower =  async (sbtId: number, chainId: number, provider: Web3Provider) => {
    const multiHonor = getMultiHonor(chainId, provider)
    const vePower = await multiHonor.VEPower(sbtId)
    return(vePower)
}

const getVePoint =  async (sbtId: number, chainId: number, provider: Web3Provider) => {
    const multiHonor = getMultiHonor(chainId, provider)
    const vePoint = await multiHonor.VEPoint(sbtId)
    return(vePoint)
}

const getEventPoint = async (sbtId: number, chainId: number, provider: Web3Provider) => {
    const multiHonor = getMultiHonor(chainId, provider)
    const eventPoint = await multiHonor.EventPoint(sbtId)
    return(eventPoint)
}

const getPOC =  async (sbtId: number, chainId: number, provider: Web3Provider) => {
    const multiHonor = getMultiHonor(chainId, provider)
    const POC = await multiHonor.POC(sbtId)
    return(POC)
}

const getTotalPoint =  async (sbtId: number, chainId: number, provider: Web3Provider) => {
    const multiHonor = getMultiHonor(chainId, provider)
    const totalPoint = await multiHonor.TotalPoint(sbtId)
    return(totalPoint)
}

const getLevel =  async (sbtId: number, chainId: number, provider: Web3Provider) => {
    const multiHonor = getMultiHonor(chainId, provider)
    const level = await multiHonor.Level(sbtId)
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
        return(true)
    } catch(err: any) {
        console.log(err.message)
        return(false)
    }
}


const unDelegateVeMultiToSBT = async (veId: number, daoId: number, chainId: number, provider: Web3Provider) => {
    const oracleSender = getOracleSender(chainId, provider)
    // try {
    //     const tx = await oracleSender.unDelegateVEPower(veId, daoId)
    //     await tx.wait()
    // } catch(err: any) {
    //     console.log(err.message)
    // }
}


const findRewards = async (sbtId: number, chainId: number, provider: Web3Provider) => {
    return(0)
}


const getRewards = async (sbtId: number, chainId: number, provider: Web3Provider) => {

}

const sbtExistXChain = async (account: string, chainId: number, sbtNetwork: [number, number]) => {
    var thisChainId
    var exist
    for (var ii=0; ii<sbtNetwork.length; ii++) {
        thisChainId = sbtNetwork[ii]
        if (chainId !== thisChainId) {
            exist = await sbtExistXChainTarget(account, thisChainId)
            if (exist) return(thisChainId)
        }
    }
    return(undefined)
}

const sbtExistXChainTarget = async (account: string, targetChainId: number) => {

    
    const network = getNetwork(targetChainId)

    var headers = {
        'Content-Type': 'application/json'
    }

    const func = '0x' + keccak256("balanceOf(address)").toString('hex').slice(0,8)


    let calldata = ethers.utils.hexConcat([
        func,
        ethers.utils.defaultAbiCoder.encode(['address'], [account])
    ])
    
    const dataString = '{"method":"eth_call","params":[{"to":"' + String(network.contracts.idCardProxy) + '","data":"' + calldata + '"},"latest"],"id":1,"jsonrpc":"2.0"}'

    const options = {
        url: network.rpcUrl,
        method: 'POST',
        headers: headers,
        data: dataString
    }

    try {
        const response = await axios(options)
        const data = await response.data
        const exists = (data.result === "0x0000000000000000000000000000000000000000000000000000000000000001")
        //console.log(`SBT exists on chainId ${targetChainId} = ${exists}`)
        return(exists)
    } catch(error: any) {
        console.log(`Error checking balanceOf SBT on chain ${targetChainId} : ${error}`)
        return(undefined)
    }

}

const sbtExistXChainAny = async (sbtId: number) => {

    
    const network = getNetwork(137)

    var headers = {
        'Content-Type': 'application/json'
    }

    const func = '0x' + keccak256("exists(uint256)").toString('hex').slice(0,8)


    let calldata = ethers.utils.hexConcat([
        func,
        ethers.utils.defaultAbiCoder.encode(['uint256'], [sbtId])
    ])
    
    const dataString = '{"method":"eth_call","params":[{"to":"' + String(network.contracts.idCardProxy) + '","data":"' + calldata + '"},"latest"],"id":1,"jsonrpc":"2.0"}'

    const options = {
        url: network.rpcUrl,
        method: 'POST',
        headers: headers,
        data: dataString
    }

    try {
        const response = await axios(options)
        const data = await response.data
        const exists = (data.result === "0x0000000000000000000000000000000000000000000000000000000000000001")
        //console.log(`SBT exists on chainId ${targetChainId} = ${exists}`)
        return(exists)
    } catch(error: any) {
        console.log(`Error checking balanceOf SBT on Polygon : ${error}`)
        return(undefined)
    }

}


export {
    getMultiHonor,
    sbtExistXChain,
    sbtExistXChainAny,
    getCurrentEpoch,
    getCurrentEpochXChain,
    getIdNFT,
    getSBTTokenId,
    checkSbtExists,
    checkSbtOwned,
    removeSBT,
    isVeMultiDelegated,
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
