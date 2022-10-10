import React, {useCallback, useEffect, useState} from "react"
import { useWeb3React } from "@web3-react/core"


import {getNetwork} from "../utils/web3Utils"
import { Theme } from "../theme"
import styled, { DefaultTheme, keyframes } from "styled-components"
import { IconContext } from "react-icons";
import {IoIosInformationCircle as Info} from "react-icons/io"

import{getIdNFT, getCurrentEpoch, getSBT, isVeMultiDelegated, getVePower, getVePoint, getPOC, getEventPoint, getTotalPoint, getLevel, createSBT, removeSBT, findRewards, getRewards} from "../utils/multiHonor"
import { Web3Provider } from "@ethersproject/providers"
import { Contract, ethers } from "ethers";
import DelegateVeMULTI from "./DelegateVeMULTI"
import HelperBox from "./HelperBox"

import {SmallText, BigText, NormalText, Title, RowSpacer, ColumnSpacer, MainRow, NewSBTButton, RemoveSBTButton, SubTitle} from "../component-styles"

import bronzeMedal from "../images/bronze-medal.png"
import silverMedal from "../images/silver-medal.png"
import goldMedal from "../images/gold-medal.png"
import platinumMedal from "../images/platinum-medal.png"
import diamondMedal from "../images/diamond-medal.png"
import emptyMedal from "../images/empty-medal.png"


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

const TitleRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    
    width: 100%
    height: 80px;
    margin 0 100px;
`

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



const checkSBT = async (account: string, sbt: any) => {

    if (account && sbt){
        const existSBT = Boolean(Number(await sbt.balanceOf(account)))
        console.log(`SBT exists for this account: ${existSBT}`)
        return(existSBT)
    }
    else return(false)
}

const getSBTTokenId = async (account:string, sbt: any) => {
    const tokenId = await sbt.tokenOfOwnerByIndex(account, 0)
    console.log(`token ID = ${tokenId}`)
    return(tokenId)
}

interface sbtNetworkProp {
    sbtNetwork: [number]
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

    const [network, setNetwork] = useState<number | null>(null)
    const [sbt, setSbt] = useState<Contract | null>(null)
    const [idNFT, setIdNFT] = useState<Contract |null >(null)
    const [sbtExists, setSbtExists] = useState<Boolean>(false)
    const [epochStart, setEpochStart] = useState<String>("")
    const [epochEnd, setEpochEnd] = useState<String>("")
    const [claimsOutstanding, setClaimsOutstanding] = useState<number>(0)
    const [displayHelperModal, setDisplayHelperModal] = useState<Boolean>(false)
    const [helper, SetHelper] = useState<number>(0)
    

    // const [ approvalLoading, setApprovalLoading ] = useState<boolean>(false)
    // const [ displayApproval, setDisplayApproval ] = useState<boolean>(true)
    // const [ confirmLoading, setConfirmLoading ] = useState<boolean>((false))


    const { provider, chainId, accounts, isActive } = useWeb3React()

    useEffect(()=>{
        const performSBTCheck = async() => {
            if (accounts && Number(network) === 137 && provider) {
                const doesSbtExist = await checkSBT(accounts[0], sbt)
                setSbtExists(doesSbtExist)
            }
        }
        performSBTCheck()
    },[sbt, network, provider, chainId, accounts, isActive])
   

    const displaySBT = useCallback(async (account: string, sbt: any, chainId: number, provider: Web3Provider) => {
        if (sbtExists){
            const sbtId = await getSBTTokenId(account, sbt)
            const thisEpoch = await getCurrentEpoch(chainId, provider)
            setEpochStart(new Date(7257600 * thisEpoch * 1000).toISOString().slice(0, 16).replace("T", " "))
            setEpochEnd(new Date(7257600 * (thisEpoch + 1) * 1000).toISOString().slice(0, 16).replace("T", " "))
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
    },[isActive, provider, chainId, accounts, sbtExists])


    const handleRemoveSBTClick = () => {
        if (accounts && chainId && provider){
            removeExistingSBT(accounts[0], sbt, Number(network), provider)
        }
    }

    const removeExistingSBT = useCallback(async (account: string, sbt: any, chainId: number, provider: Web3Provider) => {
        console.log('Remove an existing SBT')
        removeSBT(sbtInfo.sbtId, chainId, provider)
    },[isActive, provider, chainId, accounts, sbt])

    const handleNewSBTClick = () => {
        console.log('Clicked')
        if (accounts && Number(network) === 137 && provider){
            createSBT(Number(network), provider)
        }
    }

    useEffect(()=>{
        if (isActive && provider !== undefined && Number(network) === 137 && accounts){
            if (sbtExists){
                displaySBT(accounts[0], sbt, Number(network), provider)
            }
        }
    },[network, displaySBT, sbt, isActive, provider, chainId, accounts, sbtExists])


    useEffect(() => {
        const net = getNetwork(chainId)
        console.log(`network = ${net.name}`)

        setNetwork(137)
        if (chainId === 137 && provider) {
            setSbt(getSBT(provider))
            setIdNFT(getIdNFT(chainId, provider))
        }
    }, [chainId, provider])

    useEffect(() => {

    }, [helper])

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
                    <RemoveSBTButton isActive = {true} theme={ Theme } onClick = {() => handleRemoveSBTClick()}>Remove </RemoveSBTButton>
           
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
                return(
                    <>
                        <MainRow isBottom={false}>
                        <NewSBTButton isActive = {true} theme={ Theme } onClick = {() => handleNewSBTClick()}>
                            New SBT
                        </NewSBTButton>
                        </MainRow>
                    </>
                )
            } else {
                return(
                    <>
                        <MainRow isBottom={false}>
                            <NormalText align = {"center"} left = {"0px"} width = {"350px"} top = {"30px"} theme = {Theme}>
                            Choose Polygon for your SBT
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
            Claim
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
        if (claimsOutstanding > 0 && chainId && provider) {
            await getRewards(sbtInfo.sbtId, chainId, provider)
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
            <BigText theme = {Theme}>Level {sbtInfo.level} {" "}
            {levelToBadge(sbtInfo.level)} {helperClickHandler(7)}</BigText>
            {renderMedal(sbtInfo.level)}
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
            <Title theme={ Theme }>
                Your SBT
                {helperClickHandler(1)} 
                </Title>
                {
                sbtExists
                ? <NormalText left = {"-420px"} bottom = {"-20px"} width = {"100px"} theme={Theme}>ID {sbtInfo.sbtId}</NormalText>
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
        <Title theme={ Theme }>Connect your veMULTI {helperClickHandler(9)}</Title>
        <RowSpacer size={ "5px" }/>
        </>
        :null}
        <RowSpacer size={ "2px" }/>
        {
        sbtExists && chainId
        ?
        <>
        <VeMultiPage theme = {Theme}>
             <DelegateVeMULTI sbtExists = {sbtExists} sbtId = {sbtInfo.sbtId} sbtChainId = {chainId}/>
        </VeMultiPage>
        <RowSpacer size={ "10px" }/>
        </>
        : null
        }
        {
            displayHelperModal?<HelperBox selectedHelper = {helper} onClose = {() => setDisplayHelperModal(false)}/>
            : null
        }
        </div>
    )
}

export default SBT

