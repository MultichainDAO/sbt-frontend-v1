import { ethers, Contract, BigNumber } from "ethers"
import { Web3Provider } from "@ethersproject/providers"

import {getWeb3, getNetwork} from "./web3Utils"

import {bountyContractPolygon, bountyContractBnb} from "./bountyContract"
import ERC20 from "./ERC20"

import axios from "axios"
import keccak256 from 'keccak256'

interface BountyDetails {
    symbol: string,
    decimals: number
}


const getClaimBounty = (chainId: number, provider: Web3Provider): (Contract|null) => {
    const network = getNetwork(chainId)

    let claimBountyAddr
    let claimBountyAbi
    if (network.chainId === 137) {
        claimBountyAddr =bountyContractPolygon.address
        claimBountyAbi = bountyContractPolygon.abi
    }
    else if (network.chainId === 56) {
        claimBountyAddr =bountyContractBnb.address
        claimBountyAbi = bountyContractBnb.abi
    }
    else return(null)
    
    const { ethersSigner } = getWeb3(provider)
    if (claimBountyAbi) return new Contract(claimBountyAddr, claimBountyAbi, ethersSigner)
    else return(null)
}

const bountyContractBalance = async (chainId: number, provider: Web3Provider) => {
    const claimBounty = getClaimBounty(chainId, provider)
    if (claimBounty) {
        try {
            const tokenAddr = await claimBounty.bountyToken()
            const bountyToken = new Contract(tokenAddr, ERC20, provider)
            const bal = await bountyToken.balanceOf(claimBounty.address)
            return(bal)
        } catch (err: any) {
            console.log(err.message)
            return(null)
        }
    }
    return(null)
}

const bountyClaimable = async (sbtId: number, chainId: number, provider: Web3Provider) => {
    const claimBounty = getClaimBounty(chainId, provider)
    if (claimBounty) {
        try {
            const bounty = await claimBounty.claimable(sbtId)
            return(Number(bounty))
        } catch (err: any) {
            console.log(err.message)
            return(null)
        }
    }

    return(null)
}

const bountyClaimableXChain = async (sbtId: number, targetChainId: number) => {

    const network = getNetwork(targetChainId)

    let claimBountyAddr
    if (network.chainId === 137) {
        claimBountyAddr =bountyContractPolygon.address
    }
    else if (network.chainId === 56) {
        claimBountyAddr =bountyContractBnb.address
    }
    else return(null)

    var headers = {
        'Content-Type': 'application/json'
    }

    const func = '0x' + keccak256("claimable(uint256)").toString('hex').slice(0,8)

    let calldata = ethers.utils.hexConcat([
        func,
        ethers.utils.defaultAbiCoder.encode(['uint256'], [sbtId])
    ])

    const dataString = '{"method":"eth_call","params":[{"to":"' + String(claimBountyAddr) + '","data":"' + calldata + '"},"latest"],"id":1,"jsonrpc":"2.0"}'

    const options = {
        url: network.rpcUrl,
        method: 'POST',
        headers: headers,
        data: dataString
    }

    try {
        const response = await axios(options)
        const data = await response.data
        const claimable = parseInt(data.result, 16)
        return(claimable)
    } catch(error: any) {
        console.log(`Error getting Level ${targetChainId} : ${error}`)
        return(0)
    }
}



const claimBounty = async (account: string, sbtId: number, chainId: number, provider: Web3Provider) => {
    const claimBounty = getClaimBounty(chainId, provider)
    if (claimBounty) {
        try {
            const amount = await claimBounty.claimBounty(sbtId, account, {gasLimit: 300000})
            return(amount)
        } catch (err: any) {
            console.log(err.message)
            return(null)
        }
    }
    return(null)
}

const getBountyTokenDetails = async (chainId: number, provider: Web3Provider): Promise<BountyDetails|null> => {
    const claimBounty = getClaimBounty(chainId, provider)
    if (claimBounty) {
        try {
            const tokenAddr = await claimBounty.bountyToken()
            const bountyToken = new Contract(tokenAddr, ERC20, provider)
            return({symbol: await bountyToken.symbol(), decimals: Number(await bountyToken.decimals())})
        } catch(err: any) {
            console.log(err.message)
            return(null)
        }
    }
    else {
        return(null)
    }
}

export {
    bountyContractBalance,
    bountyClaimable,
    bountyClaimableXChain,
    claimBounty,
    getBountyTokenDetails,
}