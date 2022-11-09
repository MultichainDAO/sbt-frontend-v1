import React, {useCallback, useEffect, useState} from "react"
import { useWeb3React } from "@web3-react/core"


import {getNetwork} from "../utils/web3Utils"
import { Theme } from "../theme"
import styled, { DefaultTheme, keyframes } from "styled-components"
import { IconContext } from "react-icons";
import {IoIosInformationCircle as Info} from "react-icons/io"

import {getIdNFT, getCurrentEpoch, sbtExistXChain, getSBTTokenId, checkSbtExists, checkSbtOwned, getVePower, getVePoint, getPOC, getEventPoint, getTotalPoint, getLevel, removeSBT, findRewards, getRewards} from "../utils/multiHonor"
import {userBabtTokenId, sbtBabtClaim, sbtClaim, babtExistXChain, getPremiumPrice} from "../utils/adaptor"
import { Web3Provider } from "@ethersproject/providers"
import { Contract, ethers } from "ethers";
import DelegateVeMULTI from "./DelegateVeMULTI"
import HelperBox from "./HelperBox"
import DiscordRole from "./DiscordRole"

import {SmallText, BigText, NormalText, Title, TitleRow, RowSpacer, ColumnSpacer, MainRow, ApproveSBTButton, NewSBTButton, RemoveSBTButton, ApprovalLoader, SubTitle} from "../component-styles"
import {checkApproveSbtPayment, approveSbtPayment} from "../utils/sbtPaymentUtils"

import bronzeMedal from "../images/bronze-medal-lores.png"
import silverMedal from "../images/silver-medal-lores.png"
import goldMedal from "../images/gold-medal-lores.png"
import platinumMedal from "../images/platinum-medal-lores.png"
import diamondMedal from "../images/diamond-medal-lores.png"
import emptyMedal from "../images/empty-medal-lores.png"
import { UNDEFINED_CHAINID } from "../utils/errors"


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



const InfoPage = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  padding: "10px";

  height: 200px;
  margin 0 auto;

  border-radius: 1.25rem;

  box-shadow: 0 0 40px 0 ${ props => props.theme.colors.highlightFaint };

`

const VeMultiPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  padding: "10px";

  height: 200px;
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
    margin: 0 auto;

`



const SbtLeftPanel = styled.div `
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: start;
    align-items: flex-start;

    width: 45%;
    height: 100%;
    margin: 0 auto;

    outline: 1px solid ${ props => props.theme.colors.tertiary };
    border-radius: 1.25rem;
`

const SbtRightPanel = styled.div `
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: start;
    align-items: start;


    width: 45%;
    height: 100%;
    margin: 0 auto;

    outline: 1px solid ${ props => props.theme.colors.tertiary };
    border-radius: 1.25rem;

  
    font-family: "Source Code Pro", monospace;
    font-size: 0.9rem;
`

const SbtInfoRow = styled.div `
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;

    width: 100%;
    height: 100%;

    font-family: "Source Code Pro", monospace;
    font-size: 0.9rem;
`

const SbtBuyRow = styled.div `
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;

    width: 100%;
    height: 100%;

    font-family: "Source Code Pro", monospace;
    font-size: 0.9rem;
`

const LevelRow = styled.div `
    display: flex;
    flex: 3;
    flex-direction: row;
    justify-content: start;
    align-items: start;

    width: 100%;
    height: 100%;

    font-family: "Source Code Pro", monospace;
    font-size: 0.9rem;
`

const LevelColumn = styled.div `
    display: flex;
    flex: 3;
    flex-direction: column;
    justify-content: start;
    align-items: start;

    width: 100%;
    height: 100%;

    font-family: "Source Code Pro", monospace;
    font-size: 0.9rem;
`

const ClaimRow = styled.div `
    display: flex;
    flex: 3;
    flex-direction: row;
    justify-content: start;
    align-items: start;

    width: 100%;
    height: 100%;

    font-family: "Source Code Pro", monospace;
    font-size: 0.9rem;
`


const ValueBox = styled.text<ValueBoxProps>`
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

  margin: 20px 5px 0 0;
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




interface MainRowProps {
    theme: DefaultTheme,
    isBottom: boolean
}

interface SizeProps {
    size: string
}
  
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

    

    const [sbtChainId, setSbtChainId] = useState<number | null>(null)
    const [sbtExists, setSbtExists] = useState<Boolean>(false)
    const [sbtRemoteChainId, setSbtRemoteChainId] = useState<number|null>(null)
    const [sbtRemoteName, setSbtRemoteName] = useState<string|null>(null)
    const [epochStart, setEpochStart] = useState<String>("")
    const [epochEnd, setEpochEnd] = useState<String>("")
    const [claimsOutstanding, setClaimsOutstanding] = useState<number>(0)
    const [displayHelperModal, setDisplayHelperModal] = useState<Boolean>(false)
    const [displayDiscordRole, setDisplayDiscordRole] = useState<Boolean>(false)
    const [helper, SetHelper] = useState<number>(0)
    const [approveSBT, setApproveSBT] = useState<Boolean>(true)
    const [sbtBuyReady, setSbtBuyReady] = useState<Boolean>(false)
    const [babtExists, setBabtExists] = useState<Boolean>(false)
    const [babtToken, setBabtToken] = useState<number | null>(null)
    const [sbtPrice, setSbtPrice] = useState<buySbt | null>(null)
    const [loading, setLoading] = useState<Boolean>(false)
    


    const { provider, chainId, accounts, isActive } = useWeb3React()

    useEffect(()=>{
        const performSBTCheck = async() => {
            if (accounts && chainId && provider) {
                const sbtChain = await checkSBT()
                if (sbtChain === chainId) {
                    console.log(`sbtChainId = ${sbtChainId}`)
                    const sbtTokenId = await getSBTTokenId(accounts[0], chainId, provider)
                    const isSbtOwned = await checkSbtOwned(accounts[0], sbtTokenId, Number(sbtChainId), provider)
                    console.log(`sbtExists = ${true} isSbtOwned = ${isSbtOwned}`)
                    setSbtChainId(chainId)
                    setSbtRemoteChainId(null)

                    if (isSbtOwned) {
                        setSbtExists(true)
                    }
                    else setSbtExists(false)
                }
                else if (sbtChain) {
                    const net = getNetwork(sbtChain)
                    console.log(`SBT exists remotely on ${sbtChain}`)
                    setSbtRemoteChainId(sbtChain)
                    setSbtRemoteName(net.name)
                }
                if (chainId === 56) {
                    const babtTokenId = await userBabtTokenId(accounts[0], chainId, provider)
                    if (babtTokenId) {
                        setBabtToken(babtTokenId)
                        setBabtExists(true)
                    }
                    else setBabtExists(false)
                    console.log(`babtTokenId = ${babtTokenId}`)
                }
                else {
                    const babt = await babtExistXChain(accounts[0])
                    if (babt) setBabtExists(true)
                    console.log(`BABT exists = ${babt}`)
                }
            }
        }

        const checkSBT = async () => {

            if (accounts && chainId && provider){
                const existSBT = await checkSbtExists(accounts[0], chainId, provider)
                if (existSBT) {
                    console.log(`SBT exists locally: ${existSBT}`)
                    return(chainId)
                }
                else {
                    const existSBTXChain = await sbtExistXChain(accounts[0], chainId, sbtNetwork)
                    if (existSBTXChain) {
                        console.log(`SBT exists remotely on chain ${existSBTXChain}`)
                        return(existSBTXChain)
                    }
                }
                console.log('SBT does not yet exist')
                return(undefined)
            }
            else return(undefined)
        }

        if (!sbtExists) performSBTCheck()
    },[sbtChainId, provider, chainId, accounts, isActive, sbtExists, sbtNetwork])

    
   

    const displaySBT = useCallback(async (account: string, chainId: number, provider: Web3Provider) => {
        if (sbtExists && accounts && provider && chainId){
            const sbtId = await getSBTTokenId(account, chainId, provider)
            const thisEpoch = await getCurrentEpoch(chainId, provider)
            setEpochStart(new Date(7257600 * thisEpoch * 1000).toISOString().slice(0, 10).replace("T", " "))
            setEpochEnd(new Date(7257600 * (thisEpoch + 1) * 1000).toISOString().slice(0, 10).replace("T", " "))
            //console.log(`Current Epoch = ${thisEpoch}`)
            const vePower = await getVePower(sbtId, chainId, provider)
            //console.log(`vePower = ${vePower}`)
            const vePoint = await getVePoint(sbtId, chainId, provider)
            //console.log(`vePoint = ${vePoint}`)
            const POC = await getPOC(sbtId, chainId, provider)
            //console.log(`POC = ${POC}`)
            const eventPoint = await getEventPoint(sbtId, chainId, provider)
            //console.log(`EventPoint = ${eventPoint}`)
            const totalPoint = await getTotalPoint(sbtId, chainId, provider)
            //console.log(`TotalPoint = ${totalPoint}`)
            const level = await getLevel(sbtId, chainId, provider)
            //console.log(`Level = ${level}`)
            const rewards = await findRewards(sbtId, chainId, provider)
            setClaimsOutstanding(rewards)
    
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
    },[accounts, sbtExists])


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
        console.log('Create a new SBT')
        if (accounts && chainId && provider) {
            if (sbtBuyReady){
                setLoading(true)
                sbtClaim(Number(sbtChainId), provider)
                setLoading(false)
            }
            else if (babtToken) {
                console.log('has BABT')
                setLoading(true)
                sbtBabtClaim(babtToken, chainId, provider)
                setLoading(false)
            }
        }
    }


    useEffect(()=>{
        if (isActive && provider !== undefined && Number(sbtChainId) && accounts){
            if (sbtExists){
                displaySBT(accounts[0], Number(sbtChainId), provider)
            }
        }
    },[sbtChainId, displaySBT, isActive, provider, chainId, accounts, sbtExists])


    // useEffect(() => {
    //     const net = getNetwork(chainId)
    //     console.log(`sbtChainId = ${net.name}`)

    //     if (chainId && sbtNetwork.includes(chainId) && provider){
    //         setSbtChainId(chainId)
    //     }
        
    // }, [chainId, provider, sbtNetwork])

    useEffect(() => {
        const sbtAllowance = async () => {
            if (accounts && chainId && provider) {
                if (sbtPrice) {
                    const enough = await checkApproveSbtPayment(sbtPrice, accounts[0], chainId, provider)
                    if(enough) {
                        console.log('enough allowance')
                        setApproveSBT(false)
                        setSbtBuyReady(true)
                    } else {
                        console.log('Not enough allowance')
                        setApproveSBT(true)
                        setSbtBuyReady(false)
                    }
                }
            }
        }
        if (!babtToken) sbtAllowance()
    },[sbtPrice, accounts, babtToken, chainId, provider])

    useEffect(() => {
        const getSbtPriceData = async () => {
            if (chainId && provider) {
                const price = await getPremiumPrice(chainId, provider)
                setSbtPrice(price)
                if (sbtPrice)
                    console.log(`price = ${sbtPrice.price}, paymentTokenAddr = ${sbtPrice.paymentTokenAddr}`)
            }
        }

        if (!sbtPrice) getSbtPriceData()
    }, [chainId, provider])


    const handleApproveSBTClick = async () => {
        console.log(`SBT Approval approveSBT = ${approveSBT}`)
        if (sbtPrice && approveSBT && !loading && accounts && chainId && provider) {
            setLoading(true)
            await approveSbtPayment(sbtPrice, accounts[0], chainId, provider)
            setLoading(false)
        }
    }

    const newSBT = () => {
        console.log('New SBT')
        return(
            <>
            <MainPanel theme={Theme}>
                <RowSpacer size={"20px"}/>
                {
                sbtRemoteChainId
                ?
                    <NormalText align = {"center"} left = {"20px"} width = {"500px"} top = {"30px"} theme = {Theme}>
                            You already have an SBT on {sbtRemoteName}. Please switch
                    </NormalText>
                :
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
                            <NormalText left = {"50px"} text-align = {"left"} width = {"300px"} theme = {Theme}>
                            BABT Owner. Claim your FREE SBT
                            </NormalText>
                        </SbtBuyRow>
                        </>
                    :
                        babtExists
                        ? 
                            <NormalText left = {"20px"} text-align = {"left"} width = {"500px"} theme = {Theme}>
                            BABT Owner. Connect to BNB Chain to claim your FREE SBT
                            </NormalText>
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
                            <NormalText text-align = {"left"} width = {"300px"} theme = {Theme}>
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

    const renderSBT = () => {
        if (sbtExists) {
            return(
                <>
                <ColumnSpacer size = {"5px"}/>
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
                <ColumnSpacer size = {"10px"}/>
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
                <ColumnSpacer size = {"5px"}/>
                </>

            )
        }
        else if(!sbtExists && accounts && chainId && provider){
            if(sbtNetwork.includes(chainId)) {
                return(newSBT())
            } else {
                return(
                    <>
                        <MainRow isBottom={false}>
                            <NormalText align = {"center"} left = {"0px"} width = {"350px"} top = {"30px"} theme = {Theme}>
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
            <>
            <NormalText align = {"left"} left = {"10px"} width = {"150px"} top = {"30px"} theme = {Theme}>
            Your Rewards are
            </NormalText>
            <ValueBox top = {"30px"} left = {"10px"} right = {"10px"} width = {"80px"} theme = {Theme}>{claimsOutstanding}</ValueBox>
            <ClaimButton isActive = {claimsOutstanding>0?true:false} onClick = {() => claimClickHandler()} theme = {Theme} >
                {!loading
                    ? "Claim"
                    : <><ApprovalLoader theme={ Theme }/><ApprovalLoader theme={ Theme }/><ApprovalLoader theme={ Theme }/></>
                }
            </ClaimButton>
            </>
        )
    }

    const helperClickHandler = (helperNumber: number) => {
        return (
            <IconContext.Provider value = {{color: Theme.colors.highlight, size:"2vh",style: { verticalAlign: 'top' }}}>
                <Info onClick = {() => {SetHelper(helperNumber); setDisplayHelperModal(true)}}/>
            </IconContext.Provider>
        )
    }

    const claimClickHandler = async () => {
        console.log(`claiming ${claimsOutstanding}`)
        if (!loading && claimsOutstanding > 0 && chainId && provider) {
            setLoading(true)
            await getRewards(sbtInfo.sbtId, chainId, provider)
            setLoading(false)
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
                    <LevelRow theme = {Theme}>
                    <ColumnSpacer size = {"10px"}/>
                    <DiscordButton isActive = {sbtInfo.vePower>=multiCitizenThreshold?true:false} theme = {Theme} 
                        onClick = {() => {
                            if (sbtInfo.vePower>=multiCitizenThreshold) setDisplayDiscordRole(true)
                        }}>
                         <>Multi<br></br>Citizen</>
                    </DiscordButton>
                    {helperClickHandler(10)}
                    </LevelRow>
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
            <SmallText theme = {Theme}>
            The current 12 week Epoch is {sbtInfo.currentEpoch} {helperClickHandler(8)}<br></br>
            {epochStart} to {epochEnd}
            </SmallText>
        )
    }


    return(
        <div>
        <TitleRow>
            <ColumnSpacer size = {"40%"}/>
            <Title theme={ Theme }>
                Your SBT
                {helperClickHandler(1)} 
            </Title>
        </TitleRow>
        <TitleRow>
            <ColumnSpacer size = {"40%"}/>
            {
                sbtExists
                ? <SubTitle theme={Theme}>ID {sbtInfo.sbtId}</SubTitle>
                : null
            }
        </TitleRow>
        <RowSpacer size={ "10px" }/>
        <InfoPage theme={ Theme }>
            {renderSBT()}
        </InfoPage>
        <RowSpacer size={ "2px" }/>
        {sbtExists
        ?
        <>
        <TitleRow>
            <ColumnSpacer size = {"20%"}/>
            <Title theme={ Theme }>Connect your veMULTI {helperClickHandler(9)}</Title>
        </TitleRow>
        <RowSpacer size={ "5px" }/>
        </>
        :null}
        <RowSpacer size={ "2px" }/>
        {
        sbtExists && chainId
        ?
        <>
        <VeMultiPage theme = {Theme}>
            {sbtChainId
             ?<DelegateVeMULTI sbtExists = {sbtExists} sbtId = {sbtInfo.sbtId} sbtChainId = {sbtChainId}/>
             : null
            }
        </VeMultiPage>
        <RowSpacer size={ "10px" }/>
        </>
        : null
        }
        {
            displayHelperModal?<HelperBox selectedHelper = {helper} onClose = {() => setDisplayHelperModal(false)}/>
            : null
        }
        {
            displayDiscordRole?<DiscordRole onClose = {() => setDisplayDiscordRole(false)}/>
            : null
        }
        </div>
    )
}

export default SBT

