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
import ConnectDelegate from "./ConnectDelegate"
 
interface ActiveElement {
    theme: DefaultTheme,
    isActive: boolean
}

interface DelegateProps {
    sbtExists: Boolean
}



const DelegateVeMULTI: React.FC<DelegateProps> = (props) => {


    const sbtExists = props.sbtExists

    if (sbtExists) {
        return(
            <div>
                <SubPage theme={ Theme }>
                    <RowSpacer size={ "5px" }/>
                    <SubTitle theme = {Theme}>
                    Scan your veMULTI on :
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