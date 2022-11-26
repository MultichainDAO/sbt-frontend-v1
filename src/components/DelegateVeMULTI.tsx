import {useCallback, useEffect, useState} from "react"
import { useWeb3React } from "@web3-react/core"


import {getNetwork} from "../utils/web3Utils"
import { Theme } from "../theme"
import styled, { DefaultTheme, keyframes } from "styled-components"

import UserMessage from "./UserMessage"

import {delegateVeMultiToSBT} from "../utils/multiHonor"

import {significantDigits} from "../utils/web2Utils"

import {NormalText, SubTitle, TitleRow, RowSpacer, ColumnSpacer, ApprovalLoader} from "../component-styles"
import {isVeDelegatedXChain, veMultiBalanceOf, totalLockedMulti, veMultiOfOwnerByIndex, lockedEnd} from "../utils/veMulti"
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

  width: 12%;
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

const DetachButton = styled.button<ActiveElement>`

  display: flex;
  justify-content: center;
  align-items: center;

  margin: 0 5px 0 0;
  padding: 6px 6px;

  width: 12%;
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
    delegated: boolean|undefined,
    veMultiLocked: number,
    lockedTimeEnd: number,
    lockedTimeEndString: string
}


const DelegateVeMULTI: React.FC<DelegateProps> = (props) => {


    const sbtExists = props.sbtExists
    const sbtChainId = props.sbtChainId
    

   
    const [ netw, setNetw] = useState<string>("")
    const [ myVeMulti, setMyVeMulti ] = useState<VeMultiDef[]>([])
    const [displayUserMessage, setDisplayUserMessage] = useState<Boolean>(false)
    const [message, setMessage] = useState<number>(0)
    const [loading, setLoading] = useState<Boolean>(false)

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
            let isDel: boolean| undefined
            let newVeMulti: VeMultiDef
            if (accounts && chainId && provider){
                const numberOfVeMulti = await veMultiBalanceOf(accounts[0], chainId, provider)
                console.log(`number of veMulti = ${numberOfVeMulti}`)
                for (var ii=0; ii<numberOfVeMulti; ii++) {
                    veMultiId = await veMultiOfOwnerByIndex(accounts[0],ii, chainId, provider)
                    veMultiLocked = await totalLockedMulti(veMultiId, chainId, provider)
                    endTime = await lockedEnd(veMultiId, chainId, provider)
                    isDel = await isVeDelegatedXChain(chainId, veMultiId, sbtChainId)
                    newVeMulti =  {                   
                        iD: veMultiId,
                        chainId: chainId,
                        network: net.name,
                        delegated: isDel,
                        veMultiLocked: veMultiLocked,
                        lockedTimeEnd: endTime,
                        lockedTimeEndString: new Date(endTime * 1000).toISOString().slice(0, 19).replace("T", " ")
                    }
                    VeMultiObj.push(newVeMulti)
                }
                setMyVeMulti(VeMultiObj)
            }
        }

        if (sbtExists) getVeMultiParams()

    }, [sbtExists, chainId, accounts, provider, sbtChainId])

    const veMultiList = () => {
        return(
            myVeMulti.map((thisVeMulti, i) => {
                return (
                    veMultiDetails(thisVeMulti, i)
                )
            })
        )
    }

    const attachClickHandler = async (thisVeMulti: VeMultiDef) => {
        console.log(`chainId = ${chainId} sbtChainId = ${sbtChainId}`)
        if (!loading && chainId && chainId !== sbtChainId && provider){
            setLoading(true)
            const ret = await delegateVeMultiToSBT(thisVeMulti.iD, props.sbtId, chainId, provider)
            setLoading(false)
            if (ret) {
                setMessage(1)
                setDisplayUserMessage(true)
            }
        }
    }

    const detachClickHandler = async (thisVeMulti: VeMultiDef) => {
        if (!loading && chainId && chainId !== sbtChainId && provider){
            //setLoading(true)
            //await unDelegateVeMultiToSBT(thisVeMulti.iD, props.sbtId, chainId, provider)
            //setLoading(false)
        }

    }

    const veMultiDetails = (thisVeMulti: VeMultiDef, i: number) => {
        return (
            <div key={i}>
                <VeMULTI theme = {Theme}>
                    <TextVeMulti >
                    <b>veMULTI ID: </b>{thisVeMulti.iD} 
                    <b>     On </b> {thisVeMulti.network} <br/>
                    <b>     MULTI Locked: </b> {significantDigits(String(thisVeMulti.veMultiLocked), 10)}
                    <b>     Locked Until: </b> {thisVeMulti.lockedTimeEndString}
                    </TextVeMulti>
                    {
                        thisVeMulti.delegated
                        ? <DetachButton isActive={false} theme = {Theme} onClick = {() => detachClickHandler(thisVeMulti)}>
                        {!loading
                            ? "Attached"
                            : <><ApprovalLoader theme={ Theme }/><ApprovalLoader theme={ Theme }/><ApprovalLoader theme={ Theme }/></>
                        }
                        </DetachButton>
                        : <AttachButton isActive={true} theme = {Theme} onClick = {() => attachClickHandler(thisVeMulti)}>
                        {!loading
                            ? "Attach"
                            : <><ApprovalLoader theme={ Theme }/><ApprovalLoader theme={ Theme }/><ApprovalLoader theme={ Theme }/></>
                        }
                        </AttachButton>
                    }
                </VeMULTI>
                {
                    displayUserMessage?<UserMessage selectedMessage = {message} onClose = {() => setDisplayUserMessage(false)}/>
                    : null
                }
            </div>
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
                    No veMULTI on {netw}
                    </SubTitle> 
                     <RowSpacer size={ "5px" }/>
                </div>
                :
                <>
                    
                <VeMultiContainer>
                    <SubTitle theme={Theme}>Your veMULTI </SubTitle>
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


export default DelegateVeMULTI