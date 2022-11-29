import {useCallback, useEffect, useState} from "react"
import { useWeb3React } from "@web3-react/core"


import {getNetwork} from "../utils/web3Utils"
import { Theme } from "../theme"
import styled, { DefaultTheme, keyframes } from "styled-components"

import UserMessage from "./UserMessage"

import {checkSbtExists, delegateVeMultiToSBT, sbtExistXChainAny} from "../utils/multiHonor"

import {significantDigits} from "../utils/web2Utils"

import {NormalText, SubTitle, TitleRow, ApprovalLoader, SmallText} from "../component-styles"
import {isVeDelegatedXChain, veMultiBalanceOf, totalLockedMulti, veMultiOfOwnerByIndex, lockedEnd} from "../utils/veMulti"
import { networkInterfaces } from "os"

interface InputIdProps {
    theme: DefaultTheme
}

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

const VeMultiContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 100%;
`

const DaoIdContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 15%;
  height: 90%;
  
  @media (max-width: 700px) {
    height: 9vh;
    width: 90%;
    margin: 0 1%;
    flex-direction: row;
  }
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
    height: 12vh;
    margin: 0 1%;
    flex-direction: column;
  }
`

const VeMultiList = styled.ul`
  list-style-type: none;
  width: 100%;
  height: 100%;
  margin: 2;
  padding: 0;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
`

const TextVeMulti = styled.div`
  width: "60%";
  margin: 0 2%;
  font-family: "Source Code Pro", monospace;
  font-size: 0.9rem;
  font-weight: ${props => props.title ? "bold" : ""};
  overflow-wrap: break-word;

  @media (max-width: 700px) {
    font-size: 0.7rem;
  }
`

const AttachText = styled.div<ValueBoxProps>`

  width: 100%;
  height: 20px;

  text-align: ${props => props.align? props.align : "left"};
  width: ${props => props.width? props.width : "inherited"};
  height: ${props => props.height? props.height : "inherited"};

  margin-top: ${ props => props.top};
  margin-right: ${ props => props.right};
  margin-bottom: ${props => props.bottom};
  margin-left: ${props => props.left};

  font-size: 0.7rem;
  font-weight: bold;
  letter-spacing: 0.1rem;

  color: ${props => props.color? props.color : props.theme.colors.text};

  cursor: default;

  @media (max-width: 700px) {
    font-size: 0.85rem;
    letter-spacing: 0.04rem;
    margin 1px 2px 1px 10px;
  }
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

  @media (max-width: 700px) {
    width: 80%;
    height: 30%;
    margin: 4px auto;
    font-size: 0.9rem;
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

  @media (max-width: 700px) {
    width: 80%;
    height: 30%;
    margin: 4px auto;
    font-size: 0.9rem;
  }
`

const InputId = styled.input<InputIdProps>`
  width: 100%;
  height: 100%;
  margin: 0 0 0 5px;
  padding: 0 10px;
  outline: 0px solid ${props => props.theme.colors.secondary};
  border: none;
  border-radius: 0.4rem;
  font-family: "Source Code Pro", monospace;
  font-size: 1rem;
  background-color: ${props => props.theme.colors.secondary};
  outline: 1px solid ${ props => props.theme.colors.tertiary }};
  color: ${props => props.theme.colors.text};
  transition: outline 0.01s ease;
  &:hover {
    outline: 2px solid ${props => props.theme.colors.tertiary};
  }

  @media (max-width: 700px) {
    height: 3vh;
    margin: 0 1%;
    flex-direction: column;
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
    const [delegateDaoId, setDelegateDaoId] = useState<number|null> (null)
    const [xChainSbtExists, setXChainSbtExists] = useState<boolean|undefined> (undefined)
    const [displayUserMessage, setDisplayUserMessage] = useState<Boolean>(false)
    const [message, setMessage] = useState<number>(0)
    const [loading, setLoading] = useState<Boolean>(false)

    const { provider, chainId, accounts, isActive } = useWeb3React()

    useEffect(() => {
        setDelegateDaoId(props.sbtId)
    }, [props.sbtId])

    useEffect(() => {
        const checkSbtExists = async() => {
            if (delegateDaoId) {
                const exists = await sbtExistXChainAny(delegateDaoId)
                setXChainSbtExists(exists)
            }
        }

        if (delegateDaoId) checkSbtExists()
    }, [delegateDaoId])

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
                        lockedTimeEndString: new Date(endTime * 1000).toISOString().slice(0, 11).replace("T", " ")
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
        if (!loading && delegateDaoId && xChainSbtExists && chainId && chainId !== sbtChainId && provider){
            setLoading(true)
            const ret = await delegateVeMultiToSBT(thisVeMulti.iD, delegateDaoId, chainId, provider)
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
                        ? null
                        
                        : <DaoIdContainer theme = {Theme}>
                            {
                                delegateDaoId === props.sbtId
                                ?
                                    <AttachText bottom = {"4px"} theme = {Theme}>
                                    Your DAO ID
                                    </AttachText>
                                :
                                    xChainSbtExists
                                    ?
                                        <AttachText color = {"green"} bottom = {"4px"} theme = {Theme}>
                                        NOT Your DAO ID
                                        </AttachText>
                                    :
                                        <AttachText color = {"red"} bottom = {"4px"} theme = {Theme}>
                                        No Such DAO ID
                                        </AttachText>
                            }
                            {
                                delegateDaoId || delegateDaoId === 0
                                ? <InputId type="number" step="1"  min="1" placeholder={ "-" } value={ delegateDaoId?delegateDaoId:"-" } onChange={ e => handleDaoIdChange(e.target.value) } theme={ Theme }/>
                                : null
                            }
                        </DaoIdContainer>
                         
                    }
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

    const handleDaoIdChange = (id: string) => {
        if (id.length > 0) {
            setDelegateDaoId(parseInt(id))
        }
        else {
            setDelegateDaoId(0)
        }
        
    }


    if (sbtExists) {
        return(
            <>
                {myVeMulti.length === 0
                ?
                <div>
                    <NormalText theme = {Theme}>
                    No veMULTI on {netw}
                    </NormalText> 
                </div>
                :
                <>
                    
                <VeMultiContainer>
                    <NormalText left = {"20px"} theme={Theme}>Your veMULTI </NormalText>
                    <VeMultiList>
                    {veMultiList()}
                    </VeMultiList>
                </VeMultiContainer>
                    
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