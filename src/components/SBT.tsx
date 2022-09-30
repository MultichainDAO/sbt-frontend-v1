import {useCallback, useEffect, useState} from "react"
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

import {SubPage, Title, RowSpacer, HeadingText, MainRow, InfoDisplayData, NewSBTButton, RemoveSBTButton, SubTitle} from "../component-styles"

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
            console.log(`vePower = ${vePower}`)
            const vePoint = await getVePoint(sbtId, chainId, provider)
            console.log(`vePoint = ${vePoint}`)
            const POC = await getPOC(sbtId, chainId, provider)
            console.log(`POC = ${POC}`)
            const eventPoint = await getEventPoint(sbtId, chainId, provider)
            console.log(`EventPoint = ${eventPoint}`)
            const totalPoint = await getTotalPoint(sbtId, chainId, provider)
            console.log(`TotalPoint = ${totalPoint}`)
            const level = await getLevel(sbtId, chainId, provider)
            console.log(`Level = ${level}`)
    
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
        if (chainId == 137 && provider) {
            setSbt(getSBT(provider))
            setIdNFT(getIdNFT(chainId, provider))
        }
    }, [])

    const renderSBT = () => {
        if (sbtExists) {
            return(
                <div>
                <HeadingText>SBT Status</HeadingText> 
                
                <InfoDisplayData>
                    SBT ID {sbtInfo.sbtId} <br/>
                    Level {sbtInfo.level} <br/>
                    Total Points {sbtInfo.totalPoint} <br/>
                    VE Power {sbtInfo.vePower} <br/>
                    VE Points {sbtInfo.vePoint} <br/>
                    POC {sbtInfo.POC} <br/>
                    Event Points {sbtInfo.eventPoint} <br/>
                </InfoDisplayData>
                <RowSpacer size={ "10" }/>
               
                <RemoveSBTButton isActive = {true} theme={ Theme } onClick = {() => handleRemoveSBTClick()}>Remove </RemoveSBTButton>
                 </div>
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

    return(
        <div>
        <Title theme={ Theme }>Your SBT</Title>
        <RowSpacer size={ "2" }/>
        <SubPage theme={ Theme }>
            <MainRow isBottom={false}>
                {renderSBT()}
            </MainRow>
        </SubPage>
        <RowSpacer size={ "2" }/>
        {sbtExists?<Title theme={ Theme }>Connect your veMULTI</Title>:null}
        <DelegateVeMULTI sbtExists = {sbtExists}/>
        </div>
    )
}

export default SBT

