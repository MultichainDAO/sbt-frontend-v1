
import { ethers, Contract, BigNumber } from "ethers"
import { Web3Provider } from "@ethersproject/providers"

import { getError } from "./errors"

import {getWeb3, getNetwork} from "./web3Utils"

import ERC20 from "../utils/ERC20"



const checkApproveSbtUSDC = async(amount: number, account: string, chainId: number, provider:Web3Provider) => {
    const network = getNetwork(chainId)
    const contractAddr = network.contracts.idCardProxy

    const val = BigNumber.from(String(amount)).mul(1e6)

    const usdcAddr = network.contracts.usdcAddr
    const USDC = new ethers.Contract(usdcAddr, ERC20, provider)

    console.log(`account = ${account} contractAddr = ${contractAddr}`)
    const allowance = await USDC.allowance(account, contractAddr)
    console.log(`USDC allowance = ${allowance}`)

    if(allowance >= val) return(true)
    else return(false)
}

const approveSbtUSDC = async (amount: number, account: string, chainId: number, provider:Web3Provider) => {
    const network = getNetwork(chainId)
    const { ethersSigner } = getWeb3(provider)
    const val = BigNumber.from(String(amount)).mul(1e6)

    const contractAddr = network.contracts.idCardProxy

    const usdcAddr = network.contracts.usdcAddr
    const USDC = new ethers.Contract(usdcAddr, ERC20, ethersSigner)
    
    try {
        const tx = await USDC.approve(contractAddr, val)
        await tx.wait()
        return(true)
    } catch(error: any) {
        console.log(error)
        return(false)
    }
}

export {
    checkApproveSbtUSDC,
    approveSbtUSDC,
}