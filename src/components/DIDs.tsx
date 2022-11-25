import React, {useCallback, useEffect, useState} from "react"
import { useWeb3React } from "@web3-react/core"
import styled, { DefaultTheme, keyframes } from "styled-components"

import {SmallText, BigText, NormalText, Title, TitleRow, RowSpacer, ColumnSpacer, MainRow, ApproveSBTButton, NewSBTButton, RemoveSBTButton, ApprovalLoader, SubTitle} from "../component-styles"
import { Theme } from "../theme"
import HelperBox from "./HelperBox"
import { IconContext } from "react-icons"
import {IoIosInformationCircle as Info} from "react-icons/io"
import { getIcapAddress } from "ethers/lib/utils"

import {getSBTTokenId } from "../utils/multiHonor"
import {userBabtTokenId, babtExistXChain, babtIdXChain} from "../utils/adaptor"

import babtLogo from "../images/BABT.png"
import babtLogoGrey from "../images/BABTGrey.png"



const InfoPage = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  padding: "10px";

  height: 467px;
  margin 0 auto;

  border-radius: 1.25rem;

  box-shadow: 0 0 40px 0 ${ props => props.theme.colors.highlightFaint };
`
const DidContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  height: 45vh;
`

const DidList = styled.ul`
  list-style-type: none;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-y: scroll;
`

const DidRow = styled.div `
    display: flex;
    flex: 3;
    flex-direction: row;
    justify-content: start;
    align-items: center;

    width: 100%;
    height: 100%;

    font-family: "Source Code Pro", monospace;
    font-size: 0.9rem;
`

const Did = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 98%;
  height: 10vh;
  margin: 1vh 1%;
  border-radius: 0.5rem;
  background: ${props => props.theme.colors.secondary};
  box-shadow: 0 0 40px 0 ${ props => props.theme.colors.highlightFaint };

  @media (max-width: 700px) {
    width: 90%;
    margin: 0 1%;
  }
  `
  const TextDid = styled.text`
  width: ${props => props.width? props.width : "50px"};
  margin: 0 2%;
  font-family: "Source Code Pro", monospace;
  font-size: 0.9rem;
  font-weight: bold;
  overflow-wrap: break-word;
`

  const DidImage = styled.img`
    width: 9vh;
    height: 9vh;
    margin: 5px;
    min-width: 50px;
`

  interface DidDef {
    name: string,
    id: number|null,
    logo: string,
    description: string,
  }

const DIDs: React.FC = () => {

    const [helper, SetHelper] = useState<number>(0)
    const [displayHelperModal, setDisplayHelperModal] = useState<Boolean>(false)
    const [ myDids, setMyDids ] = useState<DidDef[]>([])

    const { provider, chainId, accounts, isActive } = useWeb3React()

    useEffect(() => {
        const getDids = async () => {
            let DidObj: DidDef[] = []
            if (accounts && chainId && provider){
                let newDid: DidDef = {
                    name: "BABT",
                        id: null,
                        logo: babtLogoGrey,
                        description: ""
                }
                let babtTokenId: number|null = null
                if (chainId === 56) {
                    babtTokenId = await userBabtTokenId(accounts[0], chainId, provider)
                    //console.log(`babtTokenId = ${babtTokenId}`)
                    
                }
                else {
                    const babt = await babtExistXChain(accounts[0])
                    if (babt) {
                        babtTokenId = await babtIdXChain(accounts[0])
                    }
                }
                if (babtTokenId) {
                        newDid.id = babtTokenId
                        newDid.logo = babtLogo
                        newDid.description = "Binance Account Bound Token."
                }
                else {
                    newDid.id = null
                    newDid.description = "To get a Binance Account Bound Token, please visit Binance"
                }
                DidObj.push(newDid)

                setMyDids(DidObj)
            }
        }

        getDids()
    },[accounts, chainId, provider])


    const helperClickHandler = (helperNumber: number) => {
        return (
            <IconContext.Provider value = {{color: Theme.colors.highlight, size:"2vh",style: { verticalAlign: 'top' }}}>
                <Info onClick = {() => {SetHelper(helperNumber); setDisplayHelperModal(true)}}/>
            </IconContext.Provider>
        )
    }

    const didList = () => {
        return (
            myDids.map(thisDid => {
                return(
                   didDetails(thisDid)
                )
            })
        )
    }

    const didDetails = (thisDid: DidDef) => {
        return(
            <>
            <Did theme = {Theme}>
                <DidRow>
                    <DidImage src = {thisDid.logo} alt = ""/>
                    <b>{thisDid.name}</b>
                    <ColumnSpacer size = {"50px"}/>
                    {
                        thisDid.id
                        ? <TextDid width = {"400px"}> {thisDid.description} {"  "} Your ID is {thisDid.id}  </TextDid>
                        : <TextDid width = {"400px"}> {"    "} {thisDid.description} {helperClickHandler(12)}</TextDid>
                    }
                </DidRow>
            </Did>
            </>
        )
    }

    return(
        <div>
            <TitleRow>
                <ColumnSpacer size = {"40%"}/>
                <Title theme={ Theme }>
                    Your Decentralized IDs
                    {helperClickHandler(11)} 
                </Title>
            </TitleRow>
            <RowSpacer size={ "10px" }/>
            <InfoPage theme={ Theme }>
                <DidContainer>
                    <RowSpacer size={ "5px" }/>
                    <DidList>
                        {didList()}
                    </DidList>
                </DidContainer>
            </InfoPage>
        <RowSpacer size={ "2px" }/>
            {
            displayHelperModal?<HelperBox selectedHelper = {helper} onClose = {() => setDisplayHelperModal(false)}/>
            : null
        }
        </div>
    )
}

export default DIDs