import React, {useCallback, useEffect, useState} from "react"
import { useWeb3React } from "@web3-react/core"


import {getNetwork,  getBaseBal} from "../utils/web3Utils"
import {formatUnits} from "../utils/web2Utils"
import { Theme } from "../theme"
import styled, { DefaultTheme, keyframes } from "styled-components"
import { IconContext } from "react-icons"
import {IoIosInformationCircle as Info} from "react-icons/io"

import {getCurrentEpoch, 
    getCurrentEpochXChain, 
    sbtExistXChain, 
    getSBTTokenId, 
    getSBTTokenIdXChain, 
    checkSbtExists, 
    checkSbtOwned, 
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
    removeSBT, 
} from "../utils/multiHonor"
import {getDidAdaptorAddr, userBabtTokenId, sbtBabtClaim, sbtClaim, babtExistXChain, getPremiumPrice} from "../utils/adaptor"
import {bountyClaimable, claimBounty, getBountyTokenDetails} from "../utils/claimBounty"

import { Web3Provider } from "@ethersproject/providers"
import DelegateVeMULTI from "./DelegateVeMULTI"
import HelperBox from "./HelperBox"
import UserMessage from "./UserMessage"
import DiscordRole from "./DiscordRole"

import {SmallText, BigText, NormalText, VeMultiTitle, TitleRow, MainRow, ApproveSBTButton, NewSBTButton, RemoveSBTButton, ApprovalLoader, SubTitle} from "../component-styles"
import {checkApproveSbtPayment, approveSbtPayment} from "../utils/sbtPaymentUtils"

import bronzeMedal from "../images/bronze-medal-lores.png"
import silverMedal from "../images/silver-medal-lores.png"
import goldMedal from "../images/gold-medal-lores.png"
import platinumMedal from "../images/platinum-medal-lores.png"
import diamondMedal from "../images/diamond-medal-lores.png"
import emptyMedal from "../images/empty-medal-lores.png"
import { ethers } from "ethers"


interface ValueBoxProps {
    theme: DefaultTheme,
    align?: string,
    top?: string,
    bottom?: string,
    left?: string,
    right?: string,
    height?: string,
    width?: string
}

const SbtTitle = styled.div`

  width: 100%;
  height: 25px;

  margin: 2px auto;

  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 0.5rem;

  color: ${props => props.theme.colors.text};

  cursor: default;

  @media (max-width: 700px) {
    font-size: 1rem;
    letter-spacing: 0.3rem;
  }
`

const SbtIdRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    
    width: 100%
    //height: 40px;
    margin 8px auto;
`


const InfoPage = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  width: 100%;

  margin 0;

  border-radius: 1.25rem;

  // box-shadow: 0 0 40px 0 ${ props => props.theme.colors.highlightFaint };

  @media (max-width: 700px) {
    flex-direction: column;
    width: 100%;
  }
`

const VeMultiPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  height: 200px;
  width: 90%;
  margin 0 auto;

  border-radius: 1.25rem;

  box-shadow: 0 0 40px 0 ${ props => props.theme.colors.highlightFaint };

`


const MainPanel = styled.div `
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: start;
    align-items: flex-start;

    width: 100%;
    height: 100%;
    //margin: 0 auto;

`



const SbtLeftPanel = styled.div `
    display: flex;
    // flex: 1;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    width: 405px;
    height: 220px;
    margin: 0 0 0 10px;


    outline: 1px solid ${ props => props.theme.colors.tertiary };
    border-radius: 1.25rem;

    @media (max-width: 700px) {
        justify-content: flex-start;
        width: 98%;
        margin: 5px 1%;
    } 
`
const SbtRightPanel = styled.div `
    display: flex;
    // flex: 1;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;


    width: 405px;
    height: 220px;
    margin: 0 10px 0 0;

    outline: 1px solid ${ props => props.theme.colors.tertiary };
    border-radius: 1.25rem;

  
    font-family: "Source Code Pro", monospace;
    font-size: 0.9rem;

    @media (max-width: 700px) {
        width: 98%;
        margin: 5px 1%;
    }
`

const SbtInfoRow = styled.div `
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;

    width: 100%;
    height: 100%;

    font-family: "Source Code Pro", monospace;
    font-size: 0.9rem;

    @media (max-width: 700px) {
        width: 98%;
        height: 100px;
        margin: 0 1%;
    }
`

const SbtBuyRow = styled.div `
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;

    width: 100%;
    height: 100%;
    margin 10px auto;

    font-family: "Source Code Pro", monospace;
    font-size: 0.9rem;
`

const LevelRow = styled.div `
    display: flex;
    flex: 3;
    flex-direction: row;
    justify-content: start;
    align-items: start;

    margin: 0 10px;

    width: 100%;
    height: 100%;

    font-family: "Source Code Pro", monospace;
    font-size: 0.9rem;
`

const LevelColumn = styled.div `
    display: flex;
    flex: 3;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    width: 100%;
    height: 100%;

    font-family: "Source Code Pro", monospace;
    font-size: 0.9rem;
`

const ClaimColumn = styled.div `
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    width: 100%;
    height: 100%;
`

const ClaimRow = styled.div `
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;

    margin: 2px 0;

    width: 100%;
    height: 100%;

`


const ValueBox = styled.div<ValueBoxProps>`
    text-align: right;
    width: ${props => props.width? props.width : "50px"};
    height: ${props => props.height? props.height : "18px"};

    margin-top: ${ props => props.top};
    margin-right: ${ props => props.right};
    margin-bottom: ${props => props.bottom};
    margin-left: ${props => props.left};

    outline: 1px solid ${ props => props.theme.colors.tertiary }};
    font-family: "Source Code Pro", monospace;
    font-size: 0.9rem;
    font-weight: bold;

    background-color: ${props => props.theme.colors.highlightFaint};
    color: ${props => props.theme.colors.text};

`


const MedalImage = styled.img`
    width: 10vh;
    height: 10vh;
    margin: 5px;
    min-width: 50px;

    // @media (max-width: 700px) {
    //     height: 7vh;
    //     width: 7vh;
    // }
`

const DiscordButton = styled.button<ActiveElement>`

  display: flex;
  justify-content: center;
  align-items: center;

  margin: 20px 5px 0 0;
  padding: 6px 6px;

  width: 50%;
  height: 50%;

  border: none;
  border-radius: 0.2rem;

  font-family: "Source Code Pro", monospace;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 0.08rem;

  background-color: ${props => props.isActive ? `${props.theme.colors.highlight}` : "#a3a3c2"};
  color: ${props => props.theme.colors.secondary};

  cursor: pointer;

  opacity: 0.9;

  transition: opacity 0.01s ease;
  

  &:hover {
    opacity: ${props => props.isActive ? `1` : `0.9`};
  }
`

const ClaimButton = styled.button<ActiveElement>`

  display: flex;
  justify-content: center;
  align-items: center;

  margin: 12px 5px 0 0;
  padding: 6px 6px;

  width: 30%;
  height: 50%;

  border: none;
  border-radius: 0.2rem;

  font-family: "Source Code Pro", monospace;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 0.08rem;

  background-color: ${props => props.isActive ? `${props.theme.colors.highlight}` : "#a3a3c2"};
  color: ${props => props.theme.colors.secondary};

  cursor: pointer;

  opacity: 0.9;

  transition: opacity 0.01s ease;
  

  &:hover {
    opacity: ${props => props.isActive ? `1` : `0.9`};
  }
`

const InputAddress = styled.input`
  width: 85%;
  height: 60%;
  margin: 0 auto;
  padding: 2 1px;
  outline: 0px solid ${props => props.theme.colors.secondary};
  border: none;
  border-radius: 0.1rem;
  font-family: "Source Code Pro", monospace;
  font-size: 0.8rem;
  background-color: ${props => props.theme.colors.secondary};
  outline: 1px solid ${ props => props.theme.colors.tertiary }};
  color: ${props => props.color?props.color:props.theme.colors.text};
  transition: outline 0.01s ease;
  &:hover {
    outline: 2px solid ${props => props.theme.colors.tertiary};
  }

  @media (max-width: 700px) {
    height: 2vh;
    margin: 0 1%;
    font-size: 0.68rem;
  }
`


  
interface ActiveElement {
    theme: DefaultTheme,
    isActive: boolean
}

interface sbtNetworkProp {
    sbtNetwork: [number, number]
}

interface buySbt {
    price: number,
    paymentTokenAddr: string,
    symbol: string,
    decimals: number,
    chainId: number
}

interface BountyDetails {
    symbol: string,
    decimals: number
}


const sbtOwned = async (account: string, sbtTokenId: number, chainId: number, provider: Web3Provider) => {
    if (account && chainId && provider){
        const isOwned = checkSbtOwned(account, sbtTokenId, chainId, provider)
        return(isOwned)
    }
    else {
        return(false)
    }
}



const SBT: React.FC<sbtNetworkProp> = ({sbtNetwork}) => {

    const [sbtInfo, setSbtInfo] = useState({
        sbtId: 0,
        currentEpoch: 0,
        level: 0,
        totalPoint: 0,
        vePower: 0,
        vePoint: 0,
        POC: 0,
        eventPoint: 0,
    })

    const multiCitizenThreshold = 20

    const [minBal, setMinBal] = useState<number|null>(null)
    const [baseBal, setBaseBal] = useState<number|null>(null)
    const [sbtPolygonExists, setSbtPolygonExists] = useState<boolean>(false)
    const [sbtBnbExists, setSbtBnbExists] = useState<boolean>(false)
    const [sbtPolygonId, setSbtPolygonId] = useState<number|null>(null)
    const [sbtRemoteName, setSbtRemoteName] = useState<string|null>(null)
    const [epochStart, setEpochStart] = useState<String>("")
    const [epochEnd, setEpochEnd] = useState<String>("")
    const [claimsOutstanding, setClaimsOutstanding] = useState<number>(0)
    const [displayHelperModal, setDisplayHelperModal] = useState<Boolean>(false)
    const [displayDiscordRole, setDisplayDiscordRole] = useState<Boolean>(false)
    const [displayUserMessage, setDisplayUserMessage] = useState<Boolean>(false)
    const [helper, setHelper] = useState<number>(0)
    const [message, setMessage] = useState<number>(0)
    const [approveSBT, setApproveSBT] = useState<Boolean>(true)
    const [sbtBuyReady, setSbtBuyReady] = useState<Boolean>(false)
    const [babtExists, setBabtExists] = useState<boolean>(false)
    const [babtToken, setBabtToken] = useState<number | null>(null)
    const [sbtPrice, setSbtPrice] = useState<buySbt | null>(null)
    const [bountyTokenDetails, setBountyTokenDetails] = useState<BountyDetails|null>(null)
    const [bountyAddress, setBountyAddress] = useState<string|null>(null)
    const [loading, setLoading] = useState<Boolean>(false)
    


    const { provider, chainId, accounts, isActive } = useWeb3React()

    useEffect(() => {
        const updateNet = async() => {
            if(accounts && chainId && provider && isActive) {
                await updateBaseBal(accounts, provider)
                const network = getNetwork(chainId)
                setMinBal(network.nativeCurrency.gasToLeave)
                const price = await getPremiumPrice(chainId, provider)
                setSbtPrice(price)
                
            }
        }
        
        updateNet()
    }
    ,[accounts, chainId, provider, isActive])

    useEffect (() => {
        const updateBounty = async() => {
            if (accounts && chainId && provider) {
                const bountyToken = await getBountyTokenDetails(chainId,provider)
                if (bountyToken) {
                    setBountyTokenDetails(bountyToken)
                    setBountyAddress(accounts[0])
                }
            }
        }
        updateBounty()
    },[chainId, provider])

    useEffect(()=>{
        const performSBTCheck = async() => {
            if (accounts && chainId && provider) {
                const sbtChain = await checkSBT()
                if (sbtChain === chainId) {
                    const sbtTokenId = await getSBTTokenId(accounts[0], chainId, provider)
                    const isSbtOwned = await checkSbtOwned(accounts[0], sbtTokenId, chainId, provider)
                    //console.log(`sbtExists = ${true} isSbtOwned = ${isSbtOwned}`)

                    if (isSbtOwned) {
                        if (sbtChain === 137) {
                            setSbtPolygonExists(true)
                            setSbtPolygonId(Number(sbtTokenId))
                        }
                        else if (sbtChain === 56)
                            setSbtBnbExists(true)
                    }
                }
                else if (sbtChain) {
                    const net = getNetwork(sbtChain)
                    //console.log(`SBT exists remotely on ${sbtChain}`)
                    if (sbtChain === 137) {
                            setSbtPolygonExists(true)
                            const sbtTokenId = await getSBTTokenIdXChain(accounts[0], 137)
                            setSbtPolygonId(Number(sbtTokenId))
                    }
                    else if (sbtChain === 56)
                        setSbtBnbExists(true)
                    setSbtRemoteName(net.name)
                }
                if (chainId === 56) {
                    const babtTokenId = await userBabtTokenId(accounts[0], chainId, provider)
                    if (babtTokenId) {
                        setBabtToken(babtTokenId)
                        setBabtExists(true)
                    }
                    else setBabtExists(false)
                    //console.log(`babtTokenId = ${babtTokenId}`)
                }
                else {
                    const babt = await babtExistXChain(accounts[0])
                    if (babt) setBabtExists(true)
                    //console.log(`BABT exists = ${babt}`)
                }
            }
        }

        const checkSBT = async () => {

            if (accounts && chainId && provider){
                const existSBT = await checkSbtExists(accounts[0], chainId, sbtNetwork, provider)
                if (existSBT) {
                    return(chainId)
                }
                else {
                    const existSBTXChain = await sbtExistXChain(accounts[0], chainId, sbtNetwork)
                    if (existSBTXChain) {
                        return(existSBTXChain)
                    }
                }
                console.log('SBT does not yet exist')
                return(undefined)
            }
            else return(undefined)
        }

        performSBTCheck()
    },[provider, chainId, accounts, isActive, sbtPolygonExists, sbtBnbExists, sbtNetwork])

    
   

    


    const handleRemoveSBTClick = () => {
        if (!loading && accounts && chainId && provider){
            removeExistingSBT(accounts[0], chainId, provider)
        }
    }

    const removeExistingSBT = useCallback(async (account: string, chainId: number, provider: Web3Provider) => {
        console.log('Remove an existing SBT')
        setLoading(true)
        removeSBT(sbtInfo.sbtId, chainId, provider)
        setLoading(false)
    },[sbtInfo.sbtId])

    const handleNewSBTClick = () => {
        const newSbt = async () => {
            console.log('Create a new SBT')
            let ret
            if (accounts && chainId && provider && baseBal && minBal) {
                await updateBaseBal(accounts, provider)
                if (baseBal >= minBal) {
                    if (sbtBuyReady){
                        setLoading(true)
                        ret = await sbtClaim(Number(chainId), provider)
                        setLoading(false)
                    }
                    else if (babtToken) {
                        console.log('has BABT')
                        setLoading(true)
                        ret = await sbtBabtClaim(babtToken, chainId, provider)
                        setLoading(false)
                    }
                    if (ret) {
                        if (chainId === 137) setSbtPolygonExists(true)
                        else if (chainId === 56) setSbtBnbExists(true)
                        setMessage(2)
                        setDisplayUserMessage(true)
                    }
                }
                else {
                    console.log('Insufficient gas')
                    setMessage(3)
                    setDisplayUserMessage(true)
                }
            }
        }
        newSbt()
    }


    useEffect(()=>{

        const displaySBT = async (account: string, chainId: number, provider: Web3Provider) => {
            if (((sbtPolygonExists && chainId === 137) || ( sbtBnbExists && chainId === 56)) && accounts && provider ){
                console.log('getting SBT details')
                let thisEpoch
                let vePower
                let vePoint
                let POC
                let sbtId
                sbtId = await getSBTTokenId(account, chainId, provider)
                //console.log(`sbtId = ${sbtId}`)
                POC = await getPOC(sbtId, chainId, provider)
                //console.log(`POC = ${POC}`)
                if (chainId === 137) {
                    thisEpoch = await getCurrentEpoch(chainId, provider)
                    if (thisEpoch) {
                        setEpochStart(new Date(7257600 * thisEpoch * 1000).toISOString().slice(0, 10).replace("T", " "))
                        setEpochEnd(new Date(7257600 * (thisEpoch + 1) * 1000).toISOString().slice(0, 10).replace("T", " "))
                    }
                    //console.log(`Current Epoch = ${thisEpoch}`)
                    vePower = await getVePower(sbtId, chainId, provider)
                    //console.log(`vePower = ${vePower}`)
                    vePoint = await getVePoint(sbtId, chainId, provider)
                    //console.log(`vePoint = ${vePoint}`)
                   
                }
                else {
                    thisEpoch = await getCurrentEpochXChain(137)
                    setEpochStart(new Date(7257600 * thisEpoch * 1000).toISOString().slice(0, 10).replace("T", " "))
                    setEpochEnd(new Date(7257600 * (thisEpoch + 1) * 1000).toISOString().slice(0, 10).replace("T", " "))
                    vePower = 0
                    vePoint = 0
                }
                const eventPoint = await getEventPoint(sbtId, chainId, provider)
                //console.log(`EventPoint = ${eventPoint}`)
                const totalPoint = await getTotalPoint(sbtId, chainId, provider)
                //console.log(`TotalPoint = ${totalPoint}`)
                const level = await getLevel(sbtId, chainId, provider)
                //console.log(`Level = ${level}`)
                const bounty = await bountyClaimable(sbtId, chainId, provider)
                if (bounty && bountyTokenDetails) {
                    setClaimsOutstanding(bounty/(10**bountyTokenDetails.decimals))
                }
                else {
                    console.log(`not there yet bounty = ${bounty}`)
                }
        
                setSbtInfo({
                    sbtId: Number(sbtId),
                    currentEpoch: thisEpoch,
                    level: Number(level),
                    totalPoint: Number(totalPoint),
                    vePower: Number(vePower),
                    vePoint: Number(vePoint),
                    POC: Number(POC),
                    eventPoint: Number(eventPoint),
                })
            }
            else if (sbtPolygonExists && chainId !== 137) {
                const thisEpoch = await getCurrentEpochXChain(137)
                //console.log(`cross chain thisEpoch = ${thisEpoch}`)
                setEpochStart(new Date(7257600 * thisEpoch * 1000).toISOString().slice(0, 10).replace("T", " "))
                setEpochEnd(new Date(7257600 * (thisEpoch + 1) * 1000).toISOString().slice(0, 10).replace("T", " "))
                const sbtId = await getSBTTokenIdXChain(account, 137)
                //console.log(`cross chain sbtId = ${sbtId}`)
                const level = await getLevelXChain(sbtId, 137)
                //console.log(`cross chain level = ${level}`)
                const totalPoint = await getTotalPointXChain(sbtId, 137)
                //console.log(`cross chain totalPoint = ${totalPoint}`)
                const vePower = await getVePowerXChain(sbtId, 137)
                //console.log(`cross chain vePower = ${vePower}`)
                const vePoint = await getVePointXChain(sbtId, 137)
                //console.log(`cross chain vePoint = ${vePoint}`)
                const POC = await getPOCXChain(sbtId, 137)
                //console.log(`cross chain POC = ${POC}`)
                const eventPoint = await getEventPointXChain(sbtId, 137)
                //console.log(`cross chain eventPoint = ${eventPoint}`)

                setSbtInfo({
                    sbtId: Number(sbtId),
                    currentEpoch: Number(thisEpoch),
                    level: Number(level),
                    totalPoint: Number(totalPoint),
                    vePower: Number(vePower),
                    vePoint: Number(vePoint),
                    POC: Number(POC),
                    eventPoint: Number(eventPoint),
                })
            }
        }


        if (isActive && provider !== undefined && chainId && accounts){
            if (sbtPolygonExists || sbtBnbExists){
                displaySBT(accounts[0], chainId, provider)
            }
        }
    },[isActive, provider, chainId, accounts, sbtPolygonExists, sbtBnbExists])


    useEffect(() => {
        const sbtAllowance = async () => {
            if (((chainId === 137 && !sbtPolygonExists) || (chainId === 56 && !sbtBnbExists)) && accounts && provider) {
                await updateBaseBal(accounts, provider)
                if (sbtPrice && sbtPrice.chainId === chainId) {
                    const didAdaptorAddr = await getDidAdaptorAddr(babtExists, chainId, provider)
                    const enough = await checkApproveSbtPayment(sbtPrice, didAdaptorAddr, accounts[0], chainId, provider)
                    if(enough) {
                        setApproveSBT(false)
                        setSbtBuyReady(true)
                    } else {
                        setApproveSBT(true)
                        setSbtBuyReady(false)
                    }
                }
            }
        }
        if (!babtToken) sbtAllowance()
    },[sbtPrice, accounts, babtToken, chainId, provider, sbtPolygonExists, sbtBnbExists, babtExists])

    


    const updateBaseBal = async (accounts: string[], provider: Web3Provider) => {
        const baseBalWei = await getBaseBal(provider, accounts)
        const baseBalEth = Number(formatUnits(baseBalWei, 18))
        setBaseBal(baseBalEth)
    }


    const handleApproveSBTClick = async () => {
        if (sbtPrice && approveSBT && !loading && accounts && chainId && provider && typeof(baseBal) === "number" && minBal) {
            if (baseBal >= minBal) {
                const didAdaptorAddr = await getDidAdaptorAddr(babtExists, chainId, provider)
                setLoading(true)
                const ret = await approveSbtPayment(sbtPrice, didAdaptorAddr, accounts[0], chainId, provider)
                setLoading(false)
                if (ret) {
                    setApproveSBT(false)
                    setSbtBuyReady(true)
                }
            }
            else {
                console.log('Insufficient gas')
                setMessage(3)
                setDisplayUserMessage(true)
            }
        }
    }

    const newSBT = () => {
        return(
            <>
                <MainPanel theme={Theme}>
                    {
                    babtToken && chainId === 56
                    ? 
                        <>
                        <SbtBuyRow>
                        <NewSBTButton isActive = {true} theme={ Theme } onClick = {() => handleNewSBTClick()}>
                            {!loading
                                ? "New SBT"
                                : <><ApprovalLoader theme={ Theme }/><ApprovalLoader theme={ Theme }/><ApprovalLoader theme={ Theme }/></>
                                }
                        </NewSBTButton>
                        </SbtBuyRow>
                        <SbtBuyRow>
                            <NormalText left = {"50px"} text-align = {"left"} theme = {Theme}>
                            BABT Owner. Claim your FREE SBT
                            </NormalText>
                        </SbtBuyRow>
                        </>
                    :
                        <>
                        <SbtBuyRow>
                            <ApproveSBTButton isActive = {approveSBT && !sbtBuyReady?true:false} theme={ Theme } onClick = {() => handleApproveSBTClick()}>
                                {!loading
                                ? "Approve"
                                : <><ApprovalLoader theme={ Theme }/><ApprovalLoader theme={ Theme }/><ApprovalLoader theme={ Theme }/></>
                                }
                            </ApproveSBTButton>
                        
                            <NewSBTButton isActive = {sbtBuyReady?true:false} theme={ Theme } onClick = {() => handleNewSBTClick()}>
                            {!loading
                                ? "New SBT"
                                : <><ApprovalLoader theme={ Theme }/><ApprovalLoader theme={ Theme }/><ApprovalLoader theme={ Theme }/></>
                                }
                            </NewSBTButton>
                        </SbtBuyRow>
                        <SbtBuyRow>
                            {sbtPrice && sbtPrice.symbol
                            ?
                            <NormalText text-align = {"left"} theme = {Theme}>
                            {`Pay ${sbtPrice.price/(10**sbtPrice.decimals)} ${sbtPrice.symbol} for a new SBT`}
                            </NormalText>
                            :
                            null
                            }
                        </SbtBuyRow>
                        </>
                    
                    }
                </MainPanel>
            </>
        )
    }

    const renderPolygonSBT = () => {
        if (sbtPolygonExists) {
            return(
                <>
                <SbtLeftPanel theme = {Theme}>
                    <SbtInfoRow theme = {Theme}>
                        {vePower()}
                    </SbtInfoRow>
                    <SbtInfoRow theme = {Theme}>
                        {vePoints()}
                    </SbtInfoRow>
                    <SbtInfoRow theme = {Theme}>
                        {POC()}
                    </SbtInfoRow>
                    <SbtInfoRow theme = {Theme}>
                        {eventPoints()}
                    </SbtInfoRow>
                    <SbtInfoRow theme = {Theme}>
                        {totalPoints()}
                    </SbtInfoRow>
                    {/*<RemoveSBTButton isActive = {true} theme={ Theme } onClick = {() => handleRemoveSBTClick()}>Remove </RemoveSBTButton>*/}
           
                </SbtLeftPanel>
                <SbtRightPanel theme = {Theme}>
                    <SbtInfoRow theme = {Theme}>
                        {attainmentLevel()}
                    </SbtInfoRow>
                    <SbtInfoRow theme = {Theme}>
                        {epochInfo()}
                    </SbtInfoRow>
                    {claimRewards()}
                </SbtRightPanel>
                </>

            )
        }
        else if(!sbtPolygonExists && accounts && chainId && provider){
            if(sbtNetwork.includes(chainId)) {
                return(newSBT())
            } else {
                return(
                    <>
                        <MainRow isBottom={false}>
                            <NormalText align = {"center"} left = {"0px"} top = {"30px"} theme = {Theme}>
                            Choose BNB Chain or Polygon for your SBT
                            </NormalText>
                        </MainRow>
                    </>
                )
            }
        }
    }

    const renderBnbSBT = () => {
        if (sbtBnbExists) {
            return(
                <>
                <SbtLeftPanel theme = {Theme}>
                    <SbtInfoRow theme = {Theme}>
                        {POC()}
                    </SbtInfoRow>
                    <SbtInfoRow theme = {Theme}>
                        {eventPoints()}
                    </SbtInfoRow>
                    <SbtInfoRow theme = {Theme}>
                        {totalPoints()}
                    </SbtInfoRow>
                </SbtLeftPanel>
                <SbtRightPanel theme = {Theme}>
                    <SbtInfoRow theme = {Theme}>
                        {attainmentLevel()}
                    </SbtInfoRow>
                    <SbtInfoRow theme = {Theme}>
                        {epochInfo()}
                    </SbtInfoRow>
                    <ClaimRow theme = {Theme}>
                        {claimRewards()}
                    </ClaimRow>
                </SbtRightPanel>
                </>

            )
        }
        else if(!sbtBnbExists && accounts && chainId && provider){
            if(sbtNetwork.includes(chainId)) {
                return(newSBT())
            } else {
                return(
                    <>
                        <MainRow isBottom={false}>
                            <NormalText align = {"center"} left = {"0px"} top = {"30px"} theme = {Theme}>
                            Choose BNB Chain or Polygon for your SBT
                            </NormalText>
                        </MainRow>
                    </>
                )
            }
        }
    }

    const claimRewards = () => {
        return (
            <ClaimColumn>
                <ClaimRow>
                    <NormalText align = {"left"} left = {"5px"} top = {"15px"} theme = {Theme}>
                    Rewards:
                    </NormalText>
                    <ValueBox top = {"15px"} left = {"10px"} right = {"5px"} width = {"60px"} theme = {Theme}>{claimsOutstanding?claimsOutstanding: null}</ValueBox>
                    <NormalText align = {"left"} right = {"5px"} top = {"15px"} theme = {Theme}>
                    {bountyTokenDetails ? bountyTokenDetails.symbol: ""}
                    </NormalText>
                    <ClaimButton isActive = {claimsOutstanding>0?true:false} onClick = {() => claimClickHandler()} theme = {Theme} >
                        {!loading
                            ? "Claim"
                            : <><ApprovalLoader theme={ Theme }/><ApprovalLoader theme={ Theme }/><ApprovalLoader theme={ Theme }/></>
                        }
                    </ClaimButton>
                </ClaimRow>
                <ClaimRow>
                    <SmallText align = {"left"} left = {"15px"}  theme = {Theme}>
                        {"To: "}
                        <InputAddress color = {bountyAddress?Theme.colors.text:"red"} type="text"  placeholder={ bountyAddress?bountyAddress:"-" }  defaultValue= {bountyAddress?bountyAddress:"-"} onChange={ e => handleClaimAddressChange(e.target.value) } theme={ Theme }/>
                    </SmallText>
                </ClaimRow>
            </ClaimColumn>
        )
    }

    const handleClaimAddressChange = (claimAddress: string) => {
        if (claimAddress.length > 0) {
            if (ethers.utils.isAddress(claimAddress)) {
                setBountyAddress(claimAddress)
            }
            else {
                setBountyAddress(null)
            }
        }
    }

    const helperClickHandler = (helperNumber: number) => {
        return (
            <IconContext.Provider value = {{color: Theme.colors.highlight, size:"2vh",style: { verticalAlign: 'top' }}}>
                <Info onClick = {() => {setHelper(helperNumber); setDisplayHelperModal(true)}}/>
            </IconContext.Provider>
        )
    }

    const claimClickHandler = async () => {
        //console.log(`claiming ${claimsOutstanding}`)
        if (!loading && claimsOutstanding > 0 && accounts && chainId && (chainId === 137 || chainId === 56) && provider && baseBal && minBal) {
            await updateBaseBal(accounts, provider)
            if (baseBal >= minBal && bountyAddress) {
                setLoading(true)
                const amount = await claimBounty(bountyAddress, sbtInfo.sbtId, chainId, provider)
                if (bountyTokenDetails && amount) {
                    console.log(`claimed ${amount/(10**bountyTokenDetails.decimals)} ${bountyTokenDetails.symbol}`)
                    setMessage(4)
                }
                setLoading(false)
            }
        }
    }

    const vePower = () => {
        return (
            <>
            <SubTitle theme={Theme}>
                VEPower
                {helperClickHandler(2)}
            </SubTitle>
            <ValueBox top = {"10px"} right = {"30px"} width = {"500px"} theme = {Theme}>{sbtInfo.vePower}</ValueBox>
            </>
        )
    }


    const vePoints = () => {
        return (
            <>
            <SubTitle theme = {Theme} >VEPoints
            {helperClickHandler(3)}
            </SubTitle>
            <NormalText text-align = {"right"} top = {"5px"} right = {"10px"} theme = {Theme} ></NormalText>
            <ValueBox top = {"5px"} right = {"20px"} width = {"140px"} theme = {Theme}>{sbtInfo.vePoint}</ValueBox>
            <NormalText text-align = {"right"}  top = {"5px"} right = {"20px"} theme = {Theme}>*0.3</NormalText>
            </>
        )
    }

    const eventPoints = () => {
        return (
            <>
            <SubTitle theme = {Theme}>
                Event Points
                {helperClickHandler(5)}
            </SubTitle>
            <NormalText text-align = {"right"}  top = {"5px"} right = {"10px"} theme = {Theme} >+</NormalText>
            <ValueBox top = {"5px"} right = {"20px"} width = {"140px"} theme = {Theme}>{sbtInfo.eventPoint}</ValueBox>
            <NormalText text-align = {"right"}  top = {"5px"} right = {"20px"} theme = {Theme}>*0.1</NormalText>
            </>
        )
    }

    const POC = () => {
        return (
            <>
            <SubTitle theme = {Theme}>POC
            {helperClickHandler(4)}
            </SubTitle>
            <NormalText text-align = {"right"}  top = {"5px"} right = {"10px"} theme = {Theme} >+</NormalText>
            <ValueBox top = {"5px"} right = {"20px"} width = {"140px"} theme = {Theme}>{sbtInfo.POC}</ValueBox>
            <NormalText text-align = {"right"}  top = {"5px"} right = {"20px"} theme = {Theme}>*0.6</NormalText>
            </>
        )
    }

    const totalPoints = () => {
        return (
            <>
            <BigText theme = {Theme}>
                Vote Power
                {helperClickHandler(6)}
            </BigText>
            <NormalText text-align = {"right"}  top = {"12px"} right = {"10px"} theme = {Theme} >=</NormalText>
            <ValueBox top = {"12px"} right = {"75px"} width = {"140px"} theme = {Theme}>{sbtInfo.totalPoint}</ValueBox>
            </>
        )
    }

    const attainmentLevel = () => {
        return (
            <>
            <LevelRow theme = {Theme}>
                <LevelColumn theme = {Theme}>
                    <BigText theme = {Theme}>Level {sbtInfo.level} {" "}
                    {levelToBadge(sbtInfo.level)} {helperClickHandler(7)}
                    </BigText>
                    {
                    chainId === 137
                    ?
                        <LevelRow theme = {Theme}>
                        <DiscordButton isActive = {sbtInfo.vePower>=multiCitizenThreshold?true:false} theme = {Theme} 
                            onClick = {() => {
                                if (sbtInfo.vePower>=multiCitizenThreshold) setDisplayDiscordRole(true)
                            }}>
                            <>Multi<br></br>Citizen</>
                        </DiscordButton>
                        {helperClickHandler(10)}
                        </LevelRow>
                    : null
                    }
                </LevelColumn>
               
                {renderMedal(sbtInfo.level)}
            </LevelRow>
            </>
        )
    }

    const renderMedal = (level: number) => {
        if (level === 0) return (<MedalImage src = {emptyMedal} alt = ""/>)
        else if (level === 1) return (<MedalImage src = {bronzeMedal} alt = ""/>)
        else if (level === 2) return (<MedalImage src = {silverMedal} alt = ""/>)
        else if (level === 3) return (<MedalImage src = {goldMedal} alt = ""/>)
        else if (level === 4) return (<MedalImage src = {platinumMedal} alt = ""/>)
        else if (level === 5) return (<MedalImage src = {diamondMedal} alt = ""/>)
        else return (<></>)
    }

    const levelToBadge = (level: number) => {
        if (level === 1) return("Bronze")
        else if (level === 2) return("Silver")
        else if (level === 3) return("Gold")
        else if (level === 4) return("Platinum")
        else if (level === 5) return("Diamond")
        else return("")
    }

    const epochInfo = () => {
        return (
            <SmallText top = {"10px"} left = {"10px"} theme = {Theme}>
            The current 12 week Epoch is {sbtInfo.currentEpoch} {helperClickHandler(8)}<br></br>
            {epochStart} to {epochEnd}
            </SmallText>
        )
    }


    return(
        <>
            <TitleRow>
                <SbtTitle theme={ Theme }>
                    Your SBT
                    {helperClickHandler(1)} 
                </SbtTitle>
            </TitleRow>
            <SbtIdRow>
                {
                    (sbtPolygonExists && chainId === 137) || (sbtBnbExists && chainId === 56)
                    ? <NormalText  theme={Theme}>ID {sbtInfo.sbtId}</NormalText>
                    : sbtPolygonExists && chainId !== 56 && sbtPolygonId
                        ?  <NormalText  theme={Theme}>ID {sbtPolygonId}</NormalText>
                        : sbtBnbExists && chainId === 56
                            ? <NormalText  theme={Theme}>ID {sbtInfo.sbtId}</NormalText>
                            : null
                }
            </SbtIdRow>
            <InfoPage theme={ Theme }>
                {chainId === 137 || chainId !== 56
                ? renderPolygonSBT()
                : renderBnbSBT()
                }
            </InfoPage>
            {sbtPolygonExists
            ?
                <>
                <TitleRow>
                    <VeMultiTitle theme={ Theme }>Select a chain to scan veMULTI {helperClickHandler(9)}</VeMultiTitle>
                </TitleRow>
                </>
            :null
            }
            {
            chainId === 137
            ? null
            :
                <>
                <VeMultiPage theme = {Theme}>
                    <DelegateVeMULTI sbtExists = {sbtPolygonExists} sbtId = {sbtPolygonId} sbtChainId = {137}/>
                </VeMultiPage>
                </>
            }
            {
                displayHelperModal?<HelperBox selectedHelper = {helper} onClose = {() => setDisplayHelperModal(false)}/>
                : null
            }
            {
                displayDiscordRole?<DiscordRole onClose = {() => setDisplayDiscordRole(false)}/>
                : null
            }
            {
                displayUserMessage?<UserMessage selectedMessage = {message} onClose = {() => setDisplayUserMessage(false)}/>
                : null
            }
        </>
    )
}

export default SBT

