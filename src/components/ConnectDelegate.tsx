
import React, { useState, useEffect, useCallback } from "react"
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core"

import { formatAddr, formatUnits, significantDigits, tsToTime } from "../utils/web2Utils"
import { getNetwork, getBaseBal, WalletListOptions } from "../utils/web3Utils"

import { walletConnect } from "../utils/connectors/walletConnect"
import { metaMask } from "../utils/connectors/metaMask"

import WalletList from "./WalletList"

import { Theme } from "../theme"

import {NetworkRow, NetworkButton} from "../component-styles"



const ConnectContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  width: 360px;
  height: 100%;

  @media (max-width: 700px) {
    width: 98%;
    height: 50%;
    margin: 0 1%;
  }
`

const ConnectButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 50%;
  height: 60%;

  border: none;
  border-radius: 0.625rem;

  font-size: 0.9rem;
  font-weight: bold;

  color: ${ props => props.theme.colors.secondary };
  background-color: ${ props => props.theme.colors.highlight };

  cursor: pointer;

  opacity: 0.9;

  transition: opacity 0.1s ease, box-shadow 0.1s ease;

  &:hover {
    box-shadow: 0 0 10px 1px ${ props => props.theme.colors.highlightFaint };
    opacity: 1;
  }

  @media (max-width: 700px) {
    width: 98%;
    height: 60%;
    margin: 0 1%;
  }
`

const ConnectedPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 60%;

  border-radius: 10px;

  box-shadow: 0 0 20px 0 ${ props => props.theme.colors.highlightFaint };
`

const Balance = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 50%;
  min-width: 180px;
  height: 100%;

  outline: 1.2px solid ${ props => props.theme.colors.tertiary };
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;

  font-family: "Source Code Pro", monospace;
  font-size: 1rem;

  color: ${ props => props.theme.colors.text };
  background-color: ${ props => props.theme.colors.main };
`

const Account = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 50%;
  min-width: 180px;
  height: 100%;

  outline: 1.2px solid ${ props => props.theme.colors.tertiary };
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;

  font-family: "Source Code Pro", monospace;
  font-size: 1rem;

  color: ${ props => props.theme.colors.text };
  background-color: ${ props => props.theme.colors.main };
`

const BalAmount = styled.div`
  margin-right: 2px;
`

const BalSymbol = styled.div`
  margin-left: 2px;
`

interface ConnectDelegateProp {
  defaultNetwork: number
  sbtExists: Boolean
}

const ConnectDelegate: React.FC<ConnectDelegateProp> = (props) => {

  const defaultNetwork = props.defaultNetwork
  const sbtExists = props.sbtExists

  const [ baseBal, setBaseBal ] = useState<string>(" - ")
  const [ displayWalletList, setDisplayWalletList ] = useState<boolean>(false)
  const [ walletType, setWalletType ] = useState<WalletListOptions | null>(null)
  const [ walletSelected, setWalletSelected ] = useState<boolean>(false)
  const [newNetwork, setNewNetwork] = useState<boolean>(true)
  


  const { provider, chainId, accounts, isActive } = useWeb3React()

  const [newNetworkChain, setNewNetworkChain] = useState<number|undefined>(chainId)


  useEffect(() => {
    const loadBaseBal = async () => {
      if(!provider || !accounts) return
      const baseBalWei = await getBaseBal(provider, accounts)
      const baseBalFormatted = significantDigits(formatUnits(baseBalWei, 18), 4)
      setBaseBal(baseBalFormatted)
    }

    if(isActive) {
      setBaseBal("-")
      loadBaseBal()
    }
  }, [ isActive, provider, accounts, setBaseBal ])


  const connect = useCallback(async (): Promise<void> => {

    //if(!newNetwork && isActive && !walletSelected) return
    console.log(`newNetwork = ${newNetwork} isActive = ${isActive} walletSelected = ${walletSelected}`)
    if(!newNetwork || !isActive || !walletSelected) return

    if(walletType === WalletListOptions.WalletConnect) {
        console.log("three")
      try {
        await walletConnect.activate(newNetworkChain)
        console.log(`Connection Successful. ${ tsToTime() }`)
      } catch(err: any) {
        console.log(err.message)
        console.log(`Connection Failed. ${ tsToTime() }`)
      }

    } else if(walletType === WalletListOptions.MetaMask) {

      try {
        await metaMask.activate(newNetworkChain)
        console.log(`Connection Successful. ${ tsToTime() }`)
      } catch(err: any) {
        console.log(err.message)
        console.log(`Connection Failed. ${ tsToTime() }`)
      }

    } else {}
    setNewNetwork(false)
    setWalletSelected(true)
  }, [ isActive, walletType, newNetworkChain ])



  useEffect(() => {
    console.log('calling connect')
    connect()
  }, [ walletType, connect, newNetworkChain ])



    const networkDelegateHandler = (net: string) => {
        console.log(`Clicked delegate veMULTI for ${net}`)
        setDisplayWalletList(true)
        if (net == "ETH" && chainId !== 1) {
            setNewNetworkChain(1)
            setNewNetwork(true)
        } else if (net == "FTM" && chainId !== 250) {
            setNewNetworkChain(250)
            setNewNetwork(true)
        } else if (net == "BNB" && chainId !== 56) {
            setNewNetworkChain(56)
            setNewNetwork(true)
        }
        
    }   
    console.log(`newNetwork = ${newNetwork}`)
    // if(sbtExists && isActive && chainId && accounts && newNetwork) {
    //     return(
    //       <ConnectContainer>
    //         <ConnectedPage theme={ Theme }>
    //           <Balance theme={ Theme }><BalAmount>{ baseBal }</BalAmount><BalSymbol>{ getNetwork(chainId).nativeCurrency.symbol }</BalSymbol></Balance>
    //           <Account theme={ Theme }>{ formatAddr(accounts[ 0 ]) }</Account>
    //         </ConnectedPage>
    //       </ConnectContainer>
    //     )
    //   } else {

        if(sbtExists && isActive && chainId && accounts) {
            return (
                <>
                <ConnectContainer>
                    <ConnectedPage theme={ Theme }>
                    <Balance theme={ Theme }><BalAmount>{ baseBal }</BalAmount><BalSymbol>{ getNetwork(chainId).nativeCurrency.symbol }</BalSymbol></Balance>
                    <Account theme={ Theme }>{ formatAddr(accounts[ 0 ]) }</Account>
                    </ConnectedPage>
                </ConnectContainer>
                <NetworkRow isBottom = {false} theme = {Theme}> 
                <NetworkButton isActive = {false} theme = {Theme} onClick = {() => networkDelegateHandler("ETH")}>
                    Ethereum
                </NetworkButton>
                <NetworkButton isActive = {true} theme = {Theme} onClick = {() => networkDelegateHandler("FTM")}>
                    Fantom
                </NetworkButton>
                <NetworkButton isActive = {true} theme = {Theme} onClick = {() => networkDelegateHandler("BNB")}>
                    BNB Chain
                </NetworkButton>
            
                {
                displayWalletList
                    ? <WalletList onClose={ () => {setDisplayWalletList(false); setWalletSelected(true)}} walletType={ walletType } setWalletType={ setWalletType }/>
                    : ""
                }
                </NetworkRow>
                </>
            )
        } else {return(<></>)}
        
      //}


//   if(sbtExists && isActive && chainId && accounts && !newNetwork) {
//     return(
//         <NetworkRow isBottom = {false} theme = {Theme}> 
//         <NetworkButton isActive = {false} theme = {Theme} onClick = {() => networkDelegateHandler("ETH")}>
//             Ethereum
//         </NetworkButton>
//         <NetworkButton isActive = {true} theme = {Theme} onClick = {() => networkDelegateHandler("FTM")}>
//             Fantom
//         </NetworkButton>
//         <NetworkButton isActive = {true} theme = {Theme} onClick = {() => networkDelegateHandler("BNB")}>
//             BNB Chain
//         </NetworkButton>
//         </NetworkRow>
//     )
//     } else {
//         return (
//         <ConnectContainer>
//             <WalletList onClose={ () => {setDisplayWalletList(false)} } walletType={ walletType } setWalletType={ setWalletType }/>
            
//         </ConnectContainer>
//         )
//     }
}

export default ConnectDelegate