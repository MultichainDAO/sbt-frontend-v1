import {ethers, Contract} from "ethers"
import { Web3Provider } from "@ethersproject/providers"
import {getWeb3, getNetwork} from "./web3Utils"
import {controllerAbi, babtAbi, babtAdaptorAbi, premiumAdaptorAbi} from "./abi"
import {getPaymentTokenDetails} from "./sbtPaymentUtils"

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
        //console.log(controller)
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
                    console.log(`accountType = ${accountType} signInfo = ${signInfo}`)
                    const tx = await controller.claim(accountType, signInfo, {gasLimit: 100000})
                    await tx.wait()
                } catch(error: any) {
                    console.log(error)
                }
            }
            else return(null)
        }
        else return(null)
    }
    else return(null)
}

const sbtClaim = async (chainId: number, provider: Web3Provider) => {
    if (chainId === 56 || chainId === 137) {
        const controller = getIDNFTController(chainId, provider)
        if (controller) {
            try {
                console.log('claiming SBT')
                const accountType = ethers.utils.formatBytes32String("Default")
                const signInfo = ethers.utils.formatBytes32String("")
                const tx = await controller.claim(accountType, signInfo, {gasLimit: 100000})
                await tx.wait()
            } catch (error: any) {
                console.log(error)
            }
        }
    }
}

const getPremiumPrice = async (chainId: number, provider: Web3Provider): Promise<buySbt|null> => {
    if (chainId === 56 || chainId === 137) {
        const controller = getIDNFTController(chainId, provider)
        if (controller) {
            const premiumAdaptorAddr = await controller.dIDAdaptor(premiumClaimHash)
            const premiumAdaptor = getPremiumAdaptor(premiumAdaptorAddr, chainId, provider)
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


export {
    babt,
    getBabt,
    sbtBabtClaim,
    sbtClaim,
    userBabtTokenId,
    getPremiumPrice,
    //getDIDAdaptor,
}