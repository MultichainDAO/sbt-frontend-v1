import { ethers, Contract, BigNumber } from "ethers"
import { Web3Provider } from "@ethersproject/providers"

import {veMULTIAbi} from "./abi"

import { formatAddr, formatUnits, significantDigits, tsToTime } from "../utils/web2Utils"

import { getError } from "./errors"

import {getWeb3, getNetwork} from "./web3Utils"

import axios from "axios"
import keccak256 from "keccak256"



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

const isVeDelegatedXChain = async (fromChainID: number, ve_id: number, sbtChainId: number) => {

    const network = getNetwork(sbtChainId)

    var headers = {
        'Content-Type': 'application/json'
    }
    console.log(`fromChainID = ${fromChainID} ve_id = ${ve_id}`)

    // see https://docs.soliditylang.org/en/latest/abi-spec.html#function-selector
    const func = '0x' + keccak256("isDelegated(uint256,uint256)").toString('hex').slice(0,8)

    let calldata = ethers.utils.hexConcat([
        func,
        ethers.utils.defaultAbiCoder.encode(['uint256', 'uint256'], [fromChainID, ve_id])
    ])
    

    var dataString = '{"method":"eth_call","params":[{"to":"' + String(network.contracts.delegateCheck) + '","data":"' + calldata + '"},"latest"],"id":1,"jsonrpc":"2.0"}'

    var options = {
        url: network.rpcUrl,
        method: 'POST',
        headers: headers,
        data: dataString
    }

    try {
        const response = await axios(options)
        var data = await response.data
        //console.log(response)
        const isDel = (data.result === "0x0000000000000000000000000000000000000000000000000000000000000001")
        console.log(`isDel = ${isDel}  StatusText: ${response.statusText}`)
        return(isDel)
    } catch (error:any){
        console.log(`Error fetching veMULTI delegated status: ${error}`)
        return(undefined)
    }

}


export {
    getVeMulti,
    isVeDelegatedXChain,
    veMultiBalanceOf,
    totalLockedMulti,
    veMultiOfOwnerByIndex,
    lockedEnd
}