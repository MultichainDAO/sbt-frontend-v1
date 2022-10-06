import React, {useCallback, useEffect, useState} from "react"
import { useWeb3React } from "@web3-react/core"


import {getNetwork} from "../utils/web3Utils"
import { Theme } from "../theme"
import styled, { DefaultTheme, keyframes } from "styled-components"


import {sbtContract} from "../utils/sbtContract"
import{getIdNFT, getSBT, getVePower, getVePoint, getPOC, getEventPoint, getTotalPoint, getLevel, createSBT, removeSBT} from "../utils/multiHonor"
import { Web3Provider } from "@ethersproject/providers"
import { Contract, ethers } from "ethers";
import { Network } from "../utils/networks"
import DelegateVeMULTI from "./DelegateVeMULTI"

import {SmallText, BigText, Title, RowSpacer, ColumnSpacer, MainRow, InfoDisplayData, NewSBTButton, RemoveSBTButton, SubTitle} from "../component-styles"
import { PickerOptionsList } from "../old-omponent-styles"

import bronzeMedal from "../images/bronze-medal.png"
import silverMedal from "../images/silver-medal.png"
import goldMedal from "../images/gold-medal.png"
import platinumMedal from "../images/platinum-medal.png"
import diamondMedal from "../images/diamond-medal.png"


interface ValueBoxProps {
    theme: DefaultTheme,
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



const SbtLeftPanel = styled.div `
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
const RightText = styled.text<ValueBoxProps>`
    text-align: right;
    width: ${props => props.width? props.width : "50px"};
    height: ${props => props.height? props.height : "18px"};

    margin-top: ${ props => props.top};
    margin-right: ${ props => props.right};
    margin-bottom: ${props => props.bottom};
    margin-left: ${props => props.left};

    font-family: "Source Code Pro", monospace;
    font-size: 0.9rem;
    font-weight: bold;

    color: ${props => props.theme.colors.text};

`

const MedalImage = styled.img`
    width: 10vh;
    height: 10vh;
    margin: 5px;
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
    console.log('HA')

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
    sbtNetwork: [number, number]
  }

const SBT: React.FC<sbtNetworkProp> = ({sbtNetwork}) => {

    const [sbtInfo, setSbtInfo] = useState({
        sbtId: 0,
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
    const[sbtExists, setSbtExists] = useState<Boolean>(false)
    // const [ approvalLoading, setApprovalLoading ] = useState<boolean>(false)
    // const [ displayApproval, setDisplayApproval ] = useState<boolean>(true)
    // const [ confirmLoading, setConfirmLoading ] = useState<boolean>((false))


    const { provider, chainId, accounts, isActive } = useWeb3React()

    useEffect(()=>{
        const performSBTCheck = async() => {
            if (accounts && Number(network) == 137 && provider) {
                const sbtExists = await checkSBT(accounts[0], sbt)
                setSbtExists(sbtExists)
            }
        }
        performSBTCheck()
    },[sbt, provider, chainId, accounts, isActive])
   

    const displaySBT = useCallback(async (account: string, sbt: any, chainId: number, provider: Web3Provider) => {
        if (sbtExists){
            const sbtId = await getSBTTokenId(account, sbt)
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
    
            setSbtInfo({
                sbtId: Number(sbtId),
                level: Number(level),
                totalPoint: Number(totalPoint),
                vePower: Number(vePower),
                vePoint: Number(vePoint),
                POC: Number(POC),
                eventPoint: Number(eventPoint),
            })
        }
    },[isActive, provider, chainId, accounts, sbtExists])

    const mintNewSBT = useCallback(async (account: string, sbt: any, chainId: number, provider: Web3Provider) => {
        console.log('Creating a new SBT')
        createSBT(chainId, provider)
    },[isActive, provider, chainId, accounts, sbt])

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
        if (accounts && Number(network) == 137 && provider){
            mintNewSBT(accounts[0], sbt, Number(network), provider)
        }
    }

    useEffect(()=>{
        if (isActive && provider !== undefined && Number(network) == 137 && accounts){
            if (sbtExists){
                displaySBT(accounts[0], sbt, Number(network), provider)
            }
            else {
                mintNewSBT(accounts[0], sbt, Number(network), provider)
            }
        }
    },[isActive, provider, chainId, accounts, sbtExists])


    useEffect(() => {
        const net = getNetwork(chainId)
        console.log(`network = ${net.name}`)

        setNetwork(137)
        if (chainId === 137 && provider) {
            setSbt(getSBT(provider))
            setIdNFT(getIdNFT(chainId, provider))
        }
    }, [])

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
                        {powerToPoints()}
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
                </SbtRightPanel>
                <ColumnSpacer size = {"5px"}/>
                </>

            )
        }
        else if(!sbtExists && accounts && chainId && provider){
            if(sbtNetwork.includes(chainId)) {
                return(
                    <div>
                        <MainRow isBottom={false}>
                        <NewSBTButton isActive = {true} theme={ Theme } onClick = {() => handleNewSBTClick()}>
                            New SBT
                        </NewSBTButton>
                        </MainRow>
                    </div>
                )
            } else {
                return(
                    <div>
                        <MainRow isBottom={false}>
                            <SubTitle theme={ Theme }>
                            Choose Polygon or BNB Chain for your SBT
                            </SubTitle>
                        </MainRow>
                    </div>
                )
            }
        }
    }

    const vePower = () => {
        return (
            <>
            <SubTitle theme={Theme}>VEPower</SubTitle>
            <ValueBox top = {"10px"} right = {"30px"} width = {"500px"} theme = {Theme}>{sbtInfo.vePower}</ValueBox>
            </>
        )
    }

    const powerToPoints = () => {
        return (
            <>
            <SmallText theme = {Theme}>250*log2(VEPower)+514*VEPower =</SmallText>
            </>
        )
    }

    const vePoints = () => {
        return (
            <>
            <SubTitle theme = {Theme} >VEPoints</SubTitle>
            <RightText top = {"5px"} right = {"10px"} theme = {Theme} ></RightText>
            <ValueBox top = {"5px"} right = {"20px"} width = {"140px"} theme = {Theme}>{sbtInfo.vePoint}</ValueBox>
            <RightText top = {"5px"} right = {"20px"} theme = {Theme}>*0.3</RightText>
            </>
        )
    }

    const eventPoints = () => {
        return (
            <>
            <SubTitle theme = {Theme}>Event Points</SubTitle>
            <RightText top = {"5px"} right = {"10px"} theme = {Theme} >+</RightText>
            <ValueBox top = {"5px"} right = {"20px"} width = {"140px"} theme = {Theme}>{sbtInfo.eventPoint}</ValueBox>
            <RightText top = {"5px"} right = {"20px"} theme = {Theme}>*0.1</RightText>
            </>
        )
    }

    const POC = () => {
        return (
            <>
            <SubTitle theme = {Theme}>POC</SubTitle>
            <RightText top = {"5px"} right = {"10px"} theme = {Theme} >+</RightText>
            <ValueBox top = {"5px"} right = {"20px"} width = {"140px"} theme = {Theme}>{sbtInfo.POC}</ValueBox>
            <RightText top = {"5px"} right = {"20px"} theme = {Theme}>*0.6</RightText>
            </>
        )
    }

    const totalPoints = () => {
        return (
            <>
            <BigText theme = {Theme}>Total Vote</BigText>
            <RightText top = {"12px"} right = {"10px"} theme = {Theme} >=</RightText>
            <ValueBox top = {"12px"} right = {"75px"} width = {"140px"} theme = {Theme}>{sbtInfo.totalPoint}</ValueBox>
            </>
        )
    }

    const attainmentLevel = () => {
        return (
            <>
            <BigText theme = {Theme}>Level {sbtInfo.level}</BigText>
            <BigText theme = {Theme}>{levelToBadge(sbtInfo.level)}</BigText>
            {renderMedal(sbtInfo.level)}
            </>
        )
    }

    const renderMedal = (level: number) => {
        if (level === 1) return (<MedalImage src = {bronzeMedal} alt = ""/>)
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

    return(
        <div>
        <Title theme={ Theme }>Your SBT</Title>
        <RowSpacer size={ "10px" }/>
        <InfoPage theme={ Theme }>
            {renderSBT()}
        </InfoPage>
        <RowSpacer size={ "2px" }/>
        {sbtExists
        ?
        <>
        <Title theme={ Theme }>Connect your veMULTI</Title>
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
        </div>
    )
}

export default SBT

