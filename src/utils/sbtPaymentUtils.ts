
import { Contract, BigNumber } from "ethers"
import { Web3Provider } from "@ethersproject/providers"

import { getError } from "./errors"

import {getWeb3, getNetwork} from "./web3Utils"

import ERC20 from "./ERC20"


interface buySbt {
    price: number,
    paymentTokenAddr: string,
    symbol: string,
    decimals: number
}

interface PaymentDetails {
    symbol: string,
    decimals: number
}

const getPaymentTokenDetails = async (tokenAddr: string, chainId: number, provider: Web3Provider): Promise<PaymentDetails> => {
    const paymentToken = new Contract(tokenAddr, ERC20, provider)
    return({symbol: await paymentToken.symbol(), decimals: Number(await paymentToken.decimals())})
}

const checkApproveSbtPayment = async(sbtPrice: buySbt, didAdaptorAddr: string, account: string, chainId: number, provider:Web3Provider) => {

    const val = BigNumber.from(String(sbtPrice.price))

    const PaymentToken = new Contract(sbtPrice.paymentTokenAddr, ERC20, provider)

    const allowance = await PaymentToken.allowance(account, didAdaptorAddr)

    if(allowance >= val) return(true)
    else return(false)
}

const approveSbtPayment = async (sbtPrice: buySbt, didAdaptorAddr: string, account: string, chainId: number, provider:Web3Provider) => {
    const { ethersSigner } = getWeb3(provider)
    const val = BigNumber.from(String(sbtPrice.price))

    const PaymentToken = new Contract(sbtPrice.paymentTokenAddr, ERC20, ethersSigner)
    
    try {
        const tx = await PaymentToken.approve(didAdaptorAddr, val)
        await tx.wait()
        return(true)
    } catch(error: any) {
        console.log(error)
        return(false)
    }
}

export {
    checkApproveSbtPayment,
    approveSbtPayment,
    getPaymentTokenDetails
}