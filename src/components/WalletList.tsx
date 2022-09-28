
import React, { useState, useEffect, useRef, useCallback } from "react"
import ReactDOM from "react-dom"

import { WalletListOptions } from "../utils/web3Utils"

import mmLogo from "../images/metamask.png"
import wcLogo from "../images/wallet-connect.png"

import { Theme } from "../theme"
import { CloseIcon, ModalOverlay, ModalTitle, ModalClose, WalletListPopUp, WalletListTitleRow, WalletListItem, WalletListLogo } from "../old-omponent-styles"


interface Props {
  onClose: () => void,
  walletType: WalletListOptions | null,
  setWalletType: React.Dispatch<React.SetStateAction<WalletListOptions | null>>, 
}


const WalletList: React.FC<Props> = ({ onClose, walletType, setWalletType }) => {
  const overlay = useRef<HTMLDivElement>(null)
  const modal = useRef<HTMLDivElement>(null)



  const exitModal = useCallback((e: MouseEvent) => {
    if(overlay?.current?.contains(e.target as Node) && !modal?.current?.contains(e.target as Node)) {
      onClose()
    }
  }, [ onClose ])

  const handleWalletClick = (selected: WalletListOptions) => {
    setWalletType(selected)
    onClose()
  }



  useEffect(() => {
    document.addEventListener("mousedown", exitModal)

    return () => {
      document.removeEventListener("mousedown", exitModal)
    }
  }, [ exitModal ])



  return ReactDOM.createPortal(
    <ModalOverlay ref={ overlay }>
      <WalletListPopUp ref={ modal } theme={ Theme }>
        <WalletListTitleRow>
          <ModalTitle theme={ Theme }>
            Select Wallet
          </ModalTitle>
          <ModalClose onClick={ () => onClose() } theme={ Theme }><CloseIcon/></ModalClose>
        </WalletListTitleRow>
          <WalletListItem onClick={ () => handleWalletClick(WalletListOptions.WalletConnect) } theme={ Theme }>
            Wallet Connect <WalletListLogo src={ wcLogo }/>
          </WalletListItem>
          <hr/>
           <WalletListItem onClick={ () => handleWalletClick(WalletListOptions.MetaMask) } theme={ Theme }>
            MetaMask <WalletListLogo src={ mmLogo }/>
          </WalletListItem>
      </WalletListPopUp>
    </ModalOverlay>,
    document.getElementById("walletList")!
  )
}

export default WalletList