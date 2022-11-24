import {ethers, Contract} from "ethers"
import { Web3Provider } from "@ethersproject/providers"
import {getWeb3, getNetwork} from "./web3Utils"
import {controllerAbi, babtAbi, babtAdaptorAbi, premiumAdaptorAbi} from "./abi"
import {getPaymentTokenDetails} from "./sbtPaymentUtils"

import axios from "axios"
import keccak256 from "keccak256"
import { ZERO_ADDR } from "./web2Utils"

interface Babt {
    contract: string,
    babtClaimHash: string,
}

interface buySbt {
    price: number,
    paymentTokenAddr: string,
    symbol: string,
    decimals: number
}

const babt:Babt = {
    contract: "0x2B09d47D550061f995A3b5C6F0Fd58005215D7c8",
    babtClaimHash: "0xb63a497d1f0a88a115a9861e337eae338d0a7c9d5d6b92166cd4e1c7714d353e",
}

const premiumClaimHash = "0x0b28050d05d9fba190ff5656d934c93e58319a3c5b73c5c30a97cd17e52b5a97"

const getIDNFTController = (chainId: number, provider: Web3Provider) => {
    if (chainId === 56 || chainId === 137) {
        const network = getNetwork(chainId)
        const { ethersSigner } = getWeb3(provider)
        const controller = new Contract(network.contracts.controller, controllerAbi, ethersSigner)
        return(controller)
    }
    else return(null)
}

const getBabtAdaptor = (babtAdaptorAddr: string, chainId: number, provider: Web3Provider) => {
    if (chainId === 56) {
        const { ethersSigner } = getWeb3(provider)
        const babtAdaptor = new Contract(babtAdaptorAddr, babtAdaptorAbi, ethersSigner)
        return (babtAdaptor)
    }
    else return(null)
}

const getPremiumAdaptor = (premiumAdaptorAddr: string, chainId: number, provider: Web3Provider) => {
    if (chainId === 56 || chainId === 137) {
        const { ethersSigner } = getWeb3(provider)
        const premiumAdaptor = new Contract(premiumAdaptorAddr, premiumAdaptorAbi, ethersSigner)
        return (premiumAdaptor)
    }
    else return(null)
}

const sbtBabtClaim = async (babtTokenId: number, chainId: number, provider: Web3Provider) => {
    if (chainId === 56) {
        const controller = getIDNFTController(chainId, provider)

        if (controller) {
            const babtAdaptorAddr = await controller.dIDAdaptor(babt.babtClaimHash)
            const babtAdaptor = getBabtAdaptor(babtAdaptorAddr, chainId, provider)
            if (babtAdaptor) {
                const signInfo = await babtAdaptor.getSignInfo(babtTokenId)
                const accountType = await controller.accountTypeOf(babtTokenId)
                try {
                    const tx = await controller.claim(accountType, signInfo, {gasLimit: 300000})
                    await tx.wait()
                    return(true)
                } catch(error: any) {
                    console.log(error)
                    return(false)
                }
            }
            else return(false)
        }
        else return(false)
    }
    else return(false)
}

const sbtClaim = async (chainId: number, provider: Web3Provider) => {
    if (chainId === 56 || chainId === 137) {
        const controller = getIDNFTController(chainId, provider)
        if (controller) {
            try {
                console.log('claiming SBT')
                const accountType = ethers.utils.formatBytes32String("Default")
                const signInfo = ethers.utils.formatBytes32String("")
                const tx = await controller.claim(accountType, signInfo, {gasLimit: 300000})
                await tx.wait()
                return(true)
            } catch (error: any) {
                console.log(error)
                return(false)
            }
        }
        return(false)
    }
    return(false)
}

const getPremiumPrice = async (chainId: number, provider: Web3Provider): Promise<buySbt|null> => {
    if (chainId === 56 || chainId === 137) {
        const controller = getIDNFTController(chainId, provider)
        if (controller) {
            const premiumAdaptorAddr = await controller.dIDAdaptor(premiumClaimHash)
            const premiumAdaptor = getPremiumAdaptor(premiumAdaptorAddr, chainId, provider)
            //if (premiumAdaptor && (premiumAdaptorAddr !== ZERO_ADDR)) {
            if (premiumAdaptor) {
                const price = await premiumAdaptor.price()
                const paymentTokenAddr = await premiumAdaptor.money()
                const paymentTokenDetails = await getPaymentTokenDetails(paymentTokenAddr, chainId, provider)
                return({price: Number(price), paymentTokenAddr: paymentTokenAddr, symbol: paymentTokenDetails.symbol, decimals: paymentTokenDetails.decimals})
            }
            else return(null)
        }
        else return(null)
    }
    else return(null)
}


const getBabt = (chainId: number, provider: Web3Provider): Contract|null => {
    
    if (chainId === 56 && provider) {
        const { ethersSigner } = getWeb3(provider)
        return new Contract(babt.contract, babtAbi, ethersSigner)
    }
    else return(null)
}

const userBabtTokenId = async (account: string, chainId: number, provider: Web3Provider) => {
    if (chainId === 56) {
        const babtContract = getBabt(chainId, provider)
        if (babtContract){
            try {
                const babtTokenId = await babtContract.tokenIdOf(account)
                return(Number(babtTokenId))
            } catch (error:any) {
                console.log(error.errorArgs)
                return(null)
            }
        }
        else return(null)
    }
    else return(null)
}

const babtExistXChain = async (account: string) => {

    const network = getNetwork(56)

    var headers = {
        'Content-Type': 'application/json'
    }

    const func = '0x' + keccak256("balanceOf(address)").toString('hex').slice(0,8)


    let calldata = ethers.utils.hexConcat([
        func,
        ethers.utils.defaultAbiCoder.encode(['address'], [account])
    ])
    
    const dataString = '{"method":"eth_call","params":[{"to":"' + babt.contract + '","data":"' + calldata + '"},"latest"],"id":1,"jsonrpc":"2.0"}'

    const options = {
        url: network.rpcUrl,
        method: 'POST',
        headers: headers,
        data: dataString
    }

    try {
        const response = await axios(options)
        const data = await response.data
        //console.log(data.result)
        const exists = (data.result === "0x0000000000000000000000000000000000000000000000000000000000000001")
        //console.log(`BABT exists on BNB chain = ${exists}`)
        return(exists)
    } catch(error: any) {
        console.log(`Error checking balanceOf BABT on BNB chain : ${error}`)
        return(undefined)
    }

}

const babtIdXChain = async (account: string) => {

    const network = getNetwork(56)

    var headers = {
        'Content-Type': 'application/json'
    }

    const func = '0x' + keccak256("tokenIdOf(address)").toString('hex').slice(0,8)


    let calldata = ethers.utils.hexConcat([
        func,
        ethers.utils.defaultAbiCoder.encode(['address'], [account])
    ])
    
    const dataString = '{"method":"eth_call","params":[{"to":"' + babt.contract + '","data":"' + calldata + '"},"latest"],"id":1,"jsonrpc":"2.0"}'

    const options = {
        url: network.rpcUrl,
        method: 'POST',
        headers: headers,
        data: dataString
    }

    try {
        const response = await axios(options)
        const data = await response.data
        const id = parseInt(data.result, 16)
        return(id)
    } catch(error: any) {
        console.log(`Error checking balanceOf BABT on BNB chain : ${error}`)
        return(null)
    }

}

// const getDIDAdaptor = async (chainId: number, provider: Web3Provider) => {
//     if (chainId === 56) {
//         const controller = getBabtController(chainId, provider)
//         if (controller) {
//             const didAdaptor = await controller.dIDAdaptor(babt.typeHash)
//             console.log(`didAdaptor = ${didAdaptor}`)
//             return(didAdaptor)
//         }
//         else return (null)
//     }
//     else return(null)
// }

const getDidAdaptorAddr = async (babtExists: boolean, chainId: number, provider: Web3Provider) => {
    if (chainId === 56 || chainId === 137) {
        const controller = getIDNFTController(chainId, provider)
        if (controller && chainId === 56 && babtExists) {
            const babtAdaptorAddr = await controller.dIDAdaptor(babt.babtClaimHash)
            //console.log(`babtAdaptorAddr = ${babtAdaptorAddr}`)
            return(babtAdaptorAddr)
        }
        else if (controller) {
            const premiumAdaptorAddr = await controller.dIDAdaptor(premiumClaimHash)
            //console.log(`premiumAdaptorAddr = ${premiumAdaptorAddr}`)
            return(premiumAdaptorAddr)
        }
        else return(null)
    }
    else return(null)
}


export {
    getDidAdaptorAddr,
    babt,
    getBabt,
    sbtBabtClaim,
    sbtClaim,
    userBabtTokenId,
    babtIdXChain,
    babtExistXChain,
    getPremiumPrice,
    //getDIDAdaptor,
}