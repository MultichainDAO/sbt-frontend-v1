import {useCallback, useEffect, useState} from "react"
import { useWeb3React } from "@web3-react/core"


import {getNetwork} from "../utils/web3Utils"
import { Theme } from "../theme"
import styled, { DefaultTheme, keyframes } from "styled-components"



import {delegateVeMultiToSBT} from "../utils/multiHonor"

import {significantDigits} from "../utils/web2Utils"

import {SubTitle, RowSpacer} from "../component-styles"
import {veMultiBalanceOf, totalLockedMulti, veMultiOfOwnerByIndex, lockedEnd} from "../utils/veMulti"
import { networkInterfaces } from "os"


const VeMultiContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  height: 20vh;
`

const VeMULTI = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 98%;
  height: 6vh;
  margin: 1vh 1%;
  border-radius: 0.5rem;
  background: ${props => props.theme.colors.secondary};
  box-shadow: 0 0 40px 0 ${ props => props.theme.colors.highlightFaint };

  @media (max-width: 700px) {
    width: 90%;
    margin: 0 1%;
  }
  `

  const VeMultiList = styled.ul`
  list-style-type: none;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-y: scroll;
`

  const TextVeMulti = styled.div`
  width: ${props => props.title ? "10%" : ""};
  margin: 0 2%;
  font-family: "Source Code Pro", monospace;
  font-size: 0.9rem;
  font-weight: ${props => props.title ? "bold" : ""};
  overflow-wrap: break-word;
`
const AttachButton = styled.button<ActiveElement>`

  display: flex;
  justify-content: center;
  align-items: center;

  margin: 0 5px 0 0;
  padding: 6px 6px;

  width: 10%;
  height: 60%;

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

interface DelegateProps {
    sbtExists: Boolean,
    sbtId: number,
    sbtChainId: number
}

interface ActiveElement {
    theme: DefaultTheme,
    isActive: boolean
}

interface VeMultiDef  {
    iD: number,
    chainId: number,
    network: string,
    veMultiLocked: number,
    lockedTimeEnd: number,
    lockedTimeEndString: string
}


const DelegateVeMULTI: React.FC<DelegateProps> = (props) => {


    const sbtExists = props.sbtExists
    

   
    const [ netw, setNetw] = useState<string>("")
    const [ myVeMulti, setMyVeMulti ] = useState<VeMultiDef[]>([])

    const { provider, chainId, accounts, isActive } = useWeb3React()

    useEffect (() => {
        const getVeMultiParams = async () => { 
            const net = getNetwork(chainId)
            setNetw(net.name)
            console.log(`DELEGATE network = ${net.name}`)
            let VeMultiObj: VeMultiDef[] = []
            let veMultiId: number
            let veMultiLocked: number
            let endTime: number
            let newVeMulti: VeMultiDef
            if (accounts && chainId && provider){
                const numberOfVeMulti = await veMultiBalanceOf(accounts[0], chainId, provider)
                console.log(`number of veMulti = ${numberOfVeMulti}`)
                for (var ii=0; ii<numberOfVeMulti; ii++) {
                    veMultiId = await veMultiOfOwnerByIndex(accounts[0],ii, chainId, provider)
                    veMultiLocked = await totalLockedMulti(veMultiId, chainId, provider)
                    endTime = await lockedEnd(veMultiId, chainId, provider)
                    newVeMulti =  {                   
                        iD: veMultiId,
                        chainId: chainId,
                        network: net.name,
                        veMultiLocked: veMultiLocked,
                        lockedTimeEnd: endTime,
                        lockedTimeEndString: new Date(endTime * 1000).toISOString().slice(0, 19).replace("T", " ")
                    }
                    VeMultiObj.push(newVeMulti)
                }
                console.log(VeMultiObj)
                setMyVeMulti(VeMultiObj)
            }
        }

        if (sbtExists) getVeMultiParams()

    }, [sbtExists, chainId, accounts, provider])

    const veMultiList = () => {
        return(
            myVeMulti.map(thisVeMulti => {
                //console.log(thisVeMulti)
                return (
                    veMultiDetails(thisVeMulti)
                )
            })
        )
    }

    const attachClickHandler = async (thisVeMulti: VeMultiDef) => {
        if (chainId !== 137 && provider){
            await delegateVeMultiToSBT(thisVeMulti.iD, props.sbtId, props.sbtChainId, provider)
        }

    }

    const veMultiDetails = (thisVeMulti: VeMultiDef) => {
        return (
            <>
            <VeMULTI theme = {Theme}>
                <TextVeMulti >
                <b>veMULTI ID: </b>{thisVeMulti.iD} 
                <b>     On </b> {thisVeMulti.network} <br/>
                <b>     MULTI Locked: </b> {significantDigits(String(thisVeMulti.veMultiLocked), 10)}
                <b>     Locked Until: </b> {thisVeMulti.lockedTimeEndString}
                </TextVeMulti>
                <AttachButton isActive={true} theme = {Theme} onClick = {() => attachClickHandler(thisVeMulti)}>
                    Attach
                </AttachButton>
            </VeMULTI>
            </>
        )
    }


    if (sbtExists) {
        return(
            <>
                <RowSpacer size={ "5px" }/>
                {myVeMulti.length === 0
                ?
                <div>
                <SubTitle theme = {Theme}>
                 Choose a Network to Scan your veMULTI. None on {netw}
                </SubTitle> 
                <RowSpacer size={ "5px" }/>
                </div>
                :
                <>
                    
                <VeMultiContainer>
                    <SubTitle theme={Theme}>Your veMULTI on {netw} </SubTitle>
                    <RowSpacer size={ "5px" }/>
                    <VeMultiList>
                    {veMultiList()}
                    </VeMultiList>
                </VeMultiContainer>
                    
                <RowSpacer size={ "5px" }/>
                </>
                }
            </>
        )
    } else {
        return(
            <div>

            </div>
        )
    }
}

//<ConnectDelegate sbtExists = {sbtExists} defaultNetwork = {1}/>

export default DelegateVeMULTI