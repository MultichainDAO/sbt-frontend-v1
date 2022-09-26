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


const SubPage = styled.div`
  margin: 0 auto;

  outline: 1px solid ${ props => props.theme.colors.tertiary };
  border-radius: 1.25rem;

  box-shadow: 0 0 40px 0 ${ props => props.theme.colors.highlightFaint };

  @media (max-width: 700px) {
    width: 90%;
    margin: 0 1%;
  }
`

const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 20px;

  margin: 10px 0 0;

  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 0.5rem;

  color: ${props => props.theme.colors.text};

  cursor: default;
`

const RowSpacer = styled.div<SizeProps>`
  width: 100%;
  height: 5px;
`

const HeadingText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 50px;

  margin: 0 auto;

  font-family: "Source Code Pro", monospace;
  font-size: 1.4rem;
  font-weight: bold;
  letter-spacing: 0.1rem;

  @media (max-width: 700px) {
    width: 98%;
    margin: 0 1%;
  }
`

const MainRow = styled.div<MainRowProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  
  width: 100%;
  height: 200px;

  margin: ${props => props.isBottom ? "5px 0 10px" : "5px 0"};
`
const InfoDisplayData = styled.div`
  display: flex;
  justify-content: flex-start;

  width: 100%;

  font-family: "Source Code Pro", monospace;
  font-size: 0.9rem;
`
const NewSBTButton = styled.button<ActiveElement>`
  visibility: ${props => props.isActive ? "" : "hidden"};

  display: flex;
  justify-content: center;
  align-items: center;

  margin: 0 5px 0 0;
  padding: 0 10px;

  width: 100%;
  height: 100%;

  border: none;
  border-radius: 0.2rem;

  font-family: "Source Code Pro", monospace;
  font-size: 1.6rem;
  font-weight: bold;
  letter-spacing: 0.08rem;

  background-color: ${props => props.theme.colors.highlight};
  color: ${props => props.theme.colors.secondary};

  cursor: pointer;

  opacity: 0.9;

  transition: opacity 0.01s ease;

  &:hover {
    opacity: 1;
  }
`

const RemoveSBTButton = styled.button<ActiveElement>`
  visibility: ${props => props.isActive ? "" : "hidden"};

  display: flex;
  justify-content: center;
  align-items: center;

  margin: 0 5px 0 0;
  padding: 0 10px;

  width: 80%;
  height: 50%;

  border: none;
  border-radius: 0.2rem;

  font-family: "Source Code Pro", monospace;
  font-size: 0.6rem;
  font-weight: bold;
  letter-spacing: 0.08rem;

  background-color: ${props => props.theme.colors.highlight};
  color: ${props => props.theme.colors.secondary};

  cursor: pointer;

  opacity: 0.9;

  transition: opacity 0.01s ease;

  &:hover {
    opacity: 1;
  }
`


// ANIMATION
const bounceSmall = keyframes`
  from {
    transform: translate3d(0, 2px, 0);
  }

  to {
    transform: translate3d(0, -2px, 0);
  }
`

const ApprovalLoader = styled.span`
  display: inline-block;
  
  width: 6px;
  height: 6px;

  margin: 0 6px;

  border-radius: 50%;

  background-color: ${props => props.theme.colors.text};

  animation: ${bounceSmall} 0.3s infinite alternate;

  &:nth-child(2) {
    animation-delay: 0.1s;
  }

  &:nth-child(3) {
    animation-delay: 0.2s;
  }
`


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



const SBT: React.FC = () => {

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
    const [ approvalLoading, setApprovalLoading ] = useState<boolean>(false)
    const [ displayApproval, setDisplayApproval ] = useState<boolean>(true)
    const [ confirmLoading, setConfirmLoading ] = useState<boolean>((false))


    const { provider, chainId, accounts, isActive } = useWeb3React()

    useEffect(()=>{
        const performSBTCheck = async() => {
            if (accounts && Number(network) == 137 && provider) {
                const sbtExists = await checkSBT(accounts[0], sbt)
                setSbtExists(sbtExists)
            }
        }
        performSBTCheck()
    },[provider, chainId, accounts, isActive])
   

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
                <HeadingText>Your SBT</HeadingText> 
                
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
            return(
                <div>
                    <NewSBTButton isActive = {true} theme={ Theme } onClick = {() => handleNewSBTClick()}>
                        New SBT
                    </NewSBTButton>
                </div>
            )
        }
        
    }



    return(
        <div>
        <Title theme={ Theme }>SBT Management</Title>
        <RowSpacer size={ "2" }/>
        <SubPage theme={ Theme }>
            
            <MainRow isBottom={false}>
                {renderSBT()}
            </MainRow>
        </SubPage>
        <RowSpacer size={ "2" }/>
        <SubPage theme={ Theme }>
            <MainRow isBottom={false}>
                Validate veMULTI
            </MainRow>
        </SubPage>
        </div>
    )
}

export default SBT

