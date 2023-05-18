import { ethers, Contract, BigNumber } from "ethers"
import { Web3Provider } from "@ethersproject/providers"

import {multiHonorAbi, multiHonorBnbAbi, idCardAbi, oracleSenderAbi, autoDelegatorAbi} from "./abi"
import {sbtContract, delegatedVEQuerierContract} from "./sbtContract"

import { getError } from "./errors"

import {getWeb3, getNetwork} from "./web3Utils"

import axios from "axios"
import keccak256 from 'keccak256'
import { BreakOrContinueStatement } from "typescript"

interface multiHonorWeights {
    vePoints?: number,
    POC: number,
    event: number,
    rest?: number
}


const getMultiHonor = (chainId: number, provider: Web3Provider): (Contract|null) => {
    const network = getNetwork(chainId)

    let multiAbi
    if (chainId === 137) {
        multiAbi = multiHonorAbi
    }
    else if (chainId === 56) {
        multiAbi = multiHonorBnbAbi
    }
    else return(null)
    
    const multiHonorAddr = network.contracts.multiHonorProxy
    const { ethersSigner } = getWeb3(provider)
    if (multiAbi) return new Contract(multiHonorAddr, multiAbi, ethersSigner)
    else return(null)
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

const getWeights = async (chainId: number, provider: Web3Provider): Promise<multiHonorWeights|null> => {
    if ((chainId === 137 || chainId === 56) && provider) {
        const multiHonor = getMultiHonor(chainId, provider)
        if (multiHonor){
            let multiWeights = {} as multiHonorWeights

            if (chainId === 137) {
                multiWeights.vePoints = Number(await multiHonor.weight_vepoint()/1000)
            }
            else {
                multiWeights.rest = Number(await multiHonor.weight_rest()/1000)
            }
            multiWeights.POC = Number(await multiHonor.weight_poc()/1000)
            multiWeights.event = Number(await multiHonor.weight_event()/1000)
            return(multiWeights)
        }
        else return(null)
    }
    return(null)
}


const getCurrentEpoch = async (chainId: number, provider: Web3Provider) => {
    const multiHonor = getMultiHonor(chainId, provider)
    if (multiHonor) {
        try {
            const currentEpoch = await multiHonor.currentVEEpoch()
            return(Number(currentEpoch))
        } catch(err: any) {
            console.log(`err.code = ${err.code}`)
            console.log(err)
            return(0)
        }
    }
    else return(0)
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
        try {
            const tokenId = await sbt.tokenOfOwnerByIndex(account, 0)
            return(tokenId)
        } catch(err: any) {
            console.log(`err.code = ${err.code}`)
            console.log(err.message)
            return(0)
        }
    }
    return(null)
}

const getSBTTokenIdXChain = async (account:string, targetChainId: number) => {

    
    const network = getNetwork(targetChainId)

    var headers = {
        'Content-Type': 'application/json'
    }

    const func = '0x' + keccak256("tokenOfOwnerByIndex(address,uint256)").toString('hex').slice(0,8)

    let calldata = ethers.utils.hexConcat([
        func,
        ethers.utils.defaultAbiCoder.encode(['address','uint256'], [account, 0])
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
        const sbtId = parseInt(data.result, 16)
        return(sbtId)
    } catch(error: any) {
        console.log(`Error getting crosschain sbtId ${targetChainId} : ${error}`)
        return(0)
    }
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
    if (multiHonor) {
        try {
            const vePower = await multiHonor.VEPower(sbtId)
            return(vePower)
        } catch(err: any) {
            console.log(`err.code = ${err.code}`)
            console.log(err)
            return(0)
        }
    }
    else return(null)
}

const getVePowerXChain = async (sbtId: number, targetChainId: number) => {

    const network = getNetwork(targetChainId)

    var headers = {
        'Content-Type': 'application/json'
    }

    const func = '0x' + keccak256("VEPower(uint256)").toString('hex').slice(0,8)

    let calldata = ethers.utils.hexConcat([
        func,
        ethers.utils.defaultAbiCoder.encode(['uint256'], [sbtId])
    ])

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
        const vePower = parseInt(data.result, 16)
        return(vePower)
    } catch(error: any) {
        console.log(`Error getting vePower ${targetChainId} : ${error}`)
        return(0)
    }
}

const getVePoint =  async (sbtId: number, chainId: number, provider: Web3Provider) => {
    const multiHonor = getMultiHonor(chainId, provider)
    
    if (multiHonor) {
        try {
            const vePoint = await multiHonor.VEPoint(sbtId)
            return(vePoint)
        } catch(err: any) {
            console.log(`err.code = ${err.code}`)
            console.log(err.message)
            return(0)
        }
    }
    else return(null)
}

const getVePointXChain = async (sbtId: number, targetChainId: number) => {

    const network = getNetwork(targetChainId)

    var headers = {
        'Content-Type': 'application/json'
    }

    const func = '0x' + keccak256("VEPoint(uint256)").toString('hex').slice(0,8)

    let calldata = ethers.utils.hexConcat([
        func,
        ethers.utils.defaultAbiCoder.encode(['uint256'], [sbtId])
    ])

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
        const vePoint = parseInt(data.result, 16)
        return(vePoint)
    } catch(error: any) {
        console.log(`Error getting vePoint ${targetChainId} : ${error}`)
        return(0)
    }
}

const getEventPoint = async (sbtId: number, chainId: number, provider: Web3Provider) => {
    const multiHonor = getMultiHonor(chainId, provider)
    if (multiHonor) {
        try {
            const eventPoint = await multiHonor.EventPoint(sbtId)
            return(eventPoint)
        } catch(err: any) {
            console.log(`err.code = ${err.code}`)
            console.log(err.message)
            return(0)
        }
    }
    else return(null)
}

const getEventPointXChain = async (sbtId: number, targetChainId: number) => {

    const network = getNetwork(targetChainId)

    var headers = {
        'Content-Type': 'application/json'
    }

    const func = '0x' + keccak256("EventPoint(uint256)").toString('hex').slice(0,8)

    let calldata = ethers.utils.hexConcat([
        func,
        ethers.utils.defaultAbiCoder.encode(['uint256'], [sbtId])
    ])

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
        const eventPoint = parseInt(data.result, 16)
        return(eventPoint)
    } catch(error: any) {
        console.log(`Error getting eventPoint ${targetChainId} : ${error}`)
        return(0)
    }
}

const getPOC =  async (sbtId: number, chainId: number, provider: Web3Provider) => {
    const multiHonor = getMultiHonor(chainId, provider)
    if (multiHonor) {
        try {
            const POC = await multiHonor.POC(sbtId)
            return(POC)
        } catch(err: any) {
            console.log(`err.code = ${err.code}`)
            console.log(err.message)
            return(0)
        }
    }
    else return(null)
}

const getPOCXChain = async (sbtId: number, targetChainId: number) => {

    const network = getNetwork(targetChainId)

    var headers = {
        'Content-Type': 'application/json'
    }

    const func = '0x' + keccak256("POC(uint256)").toString('hex').slice(0,8)

    let calldata = ethers.utils.hexConcat([
        func,
        ethers.utils.defaultAbiCoder.encode(['uint256'], [sbtId])
    ])

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
        const poc = parseInt(data.result, 16)
        return(poc)
    } catch(error: any) {
        console.log(`Error getting POC ${targetChainId} : ${error}`)
        return(0)
    }
}

const getTotalPoint =  async (sbtId: number, chainId: number, provider: Web3Provider) => {
    const multiHonor = getMultiHonor(chainId, provider)
    if (multiHonor) {
        try {
            const totalPoint = await multiHonor.TotalPoint(sbtId)
            return(totalPoint)
        } catch(err: any) {
            console.log(`err.code = ${err.code}`)
            console.log(err.message)
            return(0)
        }
    }
    else return(null)
    
}

const getTotalPointXChain = async (sbtId: number, targetChainId: number) => {

    const network = getNetwork(targetChainId)

    var headers = {
        'Content-Type': 'application/json'
    }

    const func = '0x' + keccak256("TotalPoint(uint256)").toString('hex').slice(0,8)

    let calldata = ethers.utils.hexConcat([
        func,
        ethers.utils.defaultAbiCoder.encode(['uint256'], [sbtId])
    ])

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
        const totalPoint = parseInt(data.result, 16)
        return(totalPoint)
    } catch(error: any) {
        console.log(`Error getting totalPoint ${targetChainId} : ${error}`)
        return(0)
    }
}


const getLevel =  async (sbtId: number, chainId: number, provider: Web3Provider) => {
    const multiHonor = getMultiHonor(chainId, provider)
    if (multiHonor) {
        try {
            const level = await multiHonor.Level(sbtId)
            return(level)
        } catch(err: any) {
            console.log(`err.code = ${err.code}`)
            console.log(err.message)
            return(0)
        }
    }
    else return(null)
    
}

const getLevelXChain = async (sbtId: number, targetChainId: number) => {

    const network = getNetwork(targetChainId)

    var headers = {
        'Content-Type': 'application/json'
    }

    const func = '0x' + keccak256("Level(uint256)").toString('hex').slice(0,8)

    let calldata = ethers.utils.hexConcat([
        func,
        ethers.utils.defaultAbiCoder.encode(['uint256'], [sbtId])
    ])

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
        const level = parseInt(data.result, 16)
        return(level)
    } catch(error: any) {
        console.log(`Error getting Level ${targetChainId} : ${error}`)
        return(0)
    }
}



const getOracleSender = (chainId: number, provider: Web3Provider): Contract => {
    const network = getNetwork(chainId)
    const oracleSenderAddr = network.contracts.veOracleSender
    const { ethersSigner } = getWeb3(provider)
    return new Contract(oracleSenderAddr, oracleSenderAbi, ethersSigner)
}

const getVePowerOracleSender = (chainId: number, provider: Web3Provider): Contract => {
    const network = getNetwork(chainId)
    const oracleSenderAddr = network.contracts.vePowerOracleSender
    const { ethersSigner } = getWeb3(provider)
    return new Contract(oracleSenderAddr, autoDelegatorAbi, ethersSigner)
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

const autoDelegateMultiToSBT = async (veId: number, daoId: number, chainId: number, provider: Web3Provider) => {
    const oracleSender = getVePowerOracleSender(chainId, provider)
    try {
        const tx = await oracleSender.autoDelegate(veId, daoId)
        await tx.wait()
        return(true)
    } catch(err: any) {
        console.log(err.message)
        return(false)
    }
}

const isVeAutoDelegated = async(veId: number, chainId: number, provider: Web3Provider) => {
    const oracleSender = getVePowerOracleSender(chainId, provider)
    try {
        const isAuto = await oracleSender.isAutoDelegating(veId)
        console.log(`auto = ${isAuto}`)
        return(isAuto)
    } catch(err: any) {
        console.log(err.message)
        return(undefined)
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
    getWeights,
    getIdNFT,
    getSBTTokenId,
    getSBTTokenIdXChain,
    checkSbtExists,
    checkSbtOwned,
    removeSBT,
    isVeMultiDelegated,
    isVeAutoDelegated,
    getVePower,
    getVePowerXChain,
    getVePoint,
    getVePointXChain,
    getPOC,
    getPOCXChain,
    getEventPoint,
    getEventPointXChain,
    getTotalPoint,
    getTotalPointXChain,
    getLevel,
    getLevelXChain,
    delegateVeMultiToSBT,
    autoDelegateMultiToSBT,
}
