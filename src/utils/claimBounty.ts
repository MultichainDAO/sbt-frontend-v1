import { ethers, Contract, BigNumber } from "ethers"
import { Web3Provider } from "@ethersproject/providers"

import {getWeb3, getNetwork} from "./web3Utils"

import {bountyContractPolygon, bountyContractBnb} from "./bountyContract"
import ERC20 from "./ERC20"

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
    claimBounty,
    getBountyTokenDetails,
}