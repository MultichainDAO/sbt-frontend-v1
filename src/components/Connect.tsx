
import React, { useState, useEffect, useCallback } from "react"
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core"

import { formatAddr, formatUnits, significantDigits, tsToTime } from "../utils/web2Utils"
import { getNetwork, getBaseBal, WalletListOptions } from "../utils/web3Utils"

import { walletConnect } from "../utils/connectors/walletConnect"
import { metaMask } from "../utils/connectors/metaMask"

import WalletList from "./WalletList"
import {NetworkRow, NetworkButton} from "../component-styles"

import { Theme } from "../theme"
import { ethers } from "ethers"


const ConnectContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  width: 360px;
  height: 100%;

  @media (max-width: 700px) {
    width: 96%;
    height: 50%;
    margin: 0 2%;
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
  min-width: 175px;
  height: 100%;

  outline: 1.2px solid ${ props => props.theme.colors.tertiary };
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;

  font-family: "Source Code Pro", monospace;
  font-size: 1rem;

  color: ${ props => props.theme.colors.text };
  background-color: ${ props => props.theme.colors.main };

  @media (max-width: 700px) {
    font-size: 0.9rem;
  }
`

const Account = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 50%;
  min-width: 175px;
  height: 100%;

  outline: 1.2px solid ${ props => props.theme.colors.tertiary };
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;

  font-family: "Source Code Pro", monospace;
  font-size: 1rem;

  color: ${ props => props.theme.colors.text };
  background-color: ${ props => props.theme.colors.main };

  @media (max-width: 700px) {
    font-size: 0.9rem;
  }
`

const BalAmount = styled.div`
  margin-right: 2px;
`

const BalSymbol = styled.div`
  margin-left: 2px;
`

interface sbtNetworkProp {
  sbtNetwork: [number, number]
}

const Connect: React.FC<sbtNetworkProp> = ({sbtNetwork}) => {


  const [ baseBal, setBaseBal ] = useState<string>(" - ")
  const [ displayWalletList, setDisplayWalletList ] = useState<boolean>(false)
  const [ walletType, setWalletType ] = useState<WalletListOptions | null>(null)
  const [newNetwork, setNewNetwork] = useState<boolean>(false)
  const [ walletSelected, setWalletSelected ] = useState<boolean>(false)



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

    // console.log(`In connect newNetwork = ${newNetwork} walletSelected = ${walletSelected} displayWalletList = ${displayWalletList} newNetworkChain = ${newNetworkChain}`)
    if(!walletSelected ) return

    const network = getNetwork(newNetworkChain)


    if(walletType === WalletListOptions.WalletConnect) {
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
        if (err.code === 4902 && window.ethereum) {
          console.log(`Adding new chain ${network.name}`)
          await (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: network.name,
                chainId: ethers.utils.hexlify(network.chainId),
                nativeCurrency: { name: network.nativeCurrency.name, decimals: 18, symbol: network.nativeCurrency.symbol },
                rpcUrls: [network.rpcUrl],
                blockExplorerUrls: [network.blockExplorerURL]
              }
            ]
          })
        }
        else {
          console.log(err.message)
          console.log(`Connection Failed. ${ tsToTime() }`)
        }
      }

    }
    setNewNetwork(false)
  }, [walletSelected, walletType, newNetworkChain])



  useEffect(() => {
    connect()
  }, [ newNetwork, walletType, connect ])


    return(
      <>
      {
      accounts && isActive
      ?<ConnectContainer>
          <ConnectedPage theme={ Theme }>
          <Balance theme={ Theme }><BalAmount>{ baseBal }</BalAmount><BalSymbol>{ getNetwork(chainId).nativeCurrency.symbol }</BalSymbol></Balance>
          <Account theme={ Theme }>{ formatAddr(accounts[ 0 ]) }</Account>
          </ConnectedPage>
      </ConnectContainer>
      : ""
      }
      {
        !displayWalletList
      ? <NetworkRow isBottom = {false} theme = {Theme}> 
      <NetworkButton onClick={ () => {
          setNewNetworkChain(137);
          setDisplayWalletList(true);
          setWalletSelected(false);
        }
      } isActive = {(chainId===137)?false:true} theme = {Theme} >
          Polygon
      </NetworkButton>
      <NetworkButton onClick={ () => {
          setNewNetworkChain(1);
          setDisplayWalletList(true);
          setWalletSelected(false);
        }
      } isActive = {(chainId===1)?false:true} theme = {Theme} >
          Ethereum
      </NetworkButton>
      <NetworkButton onClick={ () => {
          setNewNetworkChain(250);
          setDisplayWalletList(true);
          setWalletSelected(false);
        }
      } isActive = {(chainId===250)?false:true} theme = {Theme} >
          Fantom
      </NetworkButton>
      <NetworkButton onClick={ () => {
          setNewNetworkChain(56);
          setDisplayWalletList(true);
          setWalletSelected(false);
        }
      } isActive = {(chainId===56)?false:true} theme = {Theme} >
          BNB Chain
      </NetworkButton>
      </NetworkRow>
      : 
        <NetworkRow isBottom = {false} theme = {Theme}>
          <WalletList onClose={ () => {
              setDisplayWalletList(false); 
              setNewNetwork(true); 
              setWalletSelected(true); 
            }
          } walletType={ walletType } setWalletType={ setWalletType }/>
        </NetworkRow>
      }
      
      </>
    )
}

export default Connect