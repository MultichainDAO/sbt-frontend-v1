import {useCallback, useEffect, useState} from "react"
import { useWeb3React } from "@web3-react/core"


import {getNetwork} from "../utils/web3Utils"
import { Theme } from "../theme"
import styled, { DefaultTheme, keyframes } from "styled-components"


import {sbtContract} from "../utils/sbtContract"
import { Web3Provider } from "@ethersproject/providers"
import { Contract, ethers } from "ethers";
import { Network } from "../utils/networks"

import {Title, SubPage, SubTitle, MainRow, RowSpacer, ScanForVeMULTIButton} from "../component-styles"
import {veMultiBalanceOf, totalLockedMulti, veMultiOfOwnerByIndex} from "../utils/veMulti"
 
interface ActiveElement {
    theme: DefaultTheme,
    isActive: boolean
}

interface DelegateProps {
    sbtExists: Boolean
}



const DelegateVeMULTI: React.FC<DelegateProps> = (props) => {


    const sbtExists = props.sbtExists

    const { provider, chainId, accounts, isActive } = useWeb3React()

    useEffect (() => {
        const getVeMultiParams = async () => { 
            const net = getNetwork(chainId)
            console.log(`DELEGATE network = ${net.name}`)
            console.log('GOTCHA')
            if (accounts && chainId && provider){
                const numberOfVeMulti = await veMultiBalanceOf(accounts[0], chainId, provider)
                console.log(`number of veMulti = ${numberOfVeMulti}`)
                const veMultiId = await veMultiOfOwnerByIndex(accounts[0], 0, chainId, provider)
                console.log(`veMultiId = ${veMultiId}`)
                const lockedMulti = await totalLockedMulti(veMultiId, chainId, provider)
                console.log(`Total number of locked MULTI = ${lockedMulti}`)
            }
        }

        if (sbtExists) getVeMultiParams()

    }, [sbtExists, chainId, accounts, provider])


    if (sbtExists) {
        return(
            <div>
                <SubPage theme={ Theme }>
                    <RowSpacer size={ "5px" }/>
                    <SubTitle theme = {Theme}>
                    Choose a Network to Scan your veMULTI
                    </SubTitle> 
                    <RowSpacer size={ "5px" }/>
                       
                    <MainRow isBottom={false}>

                    </MainRow>
                </SubPage>
            </div>
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