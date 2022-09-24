import {useCallback, useEffect, useState} from "react"
import { useWeb3React } from "@web3-react/core"


import {getNetwork} from "../utils/web3Utils"
import { Theme } from "../theme"
import styled, { DefaultTheme, keyframes } from "styled-components"


import {sbtContract} from "../utils/sbtContract"
import{getVePower, getVePoint, getPOC, getEventPoint, getTotalPoint, getLevel} from "../utils/multiHonor"
import { Web3Provider } from "@ethersproject/providers"
import { Contract, ethers } from "ethers";
import { Network } from "../utils/networks"

interface MainRowProps {
    theme: DefaultTheme,
    isBottom: boolean
  }


const SubPage = styled.div`
  width: 450px;

  margin: 0 auto;

  outline: 1px solid ${ props => props.theme.colors.tertiary };
  border-radius: 1.25rem;

  box-shadow: 0 0 40px 0 ${ props => props.theme.colors.highlightFaint };

  @media (max-width: 700px) {
    width: 90%;
    margin: 0 1%;
  }
`

const HeadingText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100px;

  margin: 0 auto;

  font-size: 0.9rem;
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
  height: 50px;

  margin: ${props => props.isBottom ? "5px 0 10px" : "5px 0"};
`





const checkSBT = async (account: string, sbt: any, chainId: number, provider: Web3Provider) => {
    const existSBT = Boolean(Number(await sbt.balanceOf(account)))
    console.log(`SBT exists for this account: ${existSBT}`)
    return(existSBT)
}

const getSBTTokenId = async (account:string, sbt: any) => {
    const tokenId = await sbt.tokenOfOwnerByIndex(account, 0)
    console.log(`token ID = ${tokenId}`)
    return(tokenId)
}

const mintNewSBT = async () => {

}

const SBT: React.FC = () => {

    const [sbtInfo, setSbtInfo] = useState({
        sbtId: "",
        level: "",
        totalPoint: "",
        vePower: "",
        vePoint: "",
        POC: "",
        eventPoint: "",
    })

    const [network, setNetwork] = useState<Network | null>(null)
    const [sbt, setSbt] = useState<Contract | null>(null)


    const { provider, chainId, accounts, isActive } = useWeb3React()

    
   

    const displaySBT = useCallback(async (account: string, sbt: any, chainId: number, provider: Web3Provider) => {
        if (await checkSBT(account, sbt, chainId, provider)){
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
                sbtId: sbtId,
                level: level,
                totalPoint: totalPoint,
                vePower: vePower,
                vePoint: vePoint,
                POC: POC,
                eventPoint: eventPoint,
            })
        }
    },[isActive, provider, chainId, accounts, sbt,])

    useEffect(()=>{
        if (isActive && provider !== undefined && chainId == 137 && accounts){
            displaySBT(accounts[0], sbt, chainId, provider)
        }
    },[isActive, provider, chainId, accounts, sbt])

    useEffect(() => {
        const network = getNetwork(chainId)
        console.log(`network = ${network.name}`)

        const sbt = 
        setNetwork(getNetwork(chainId))
        setSbt(new ethers.Contract(sbtContract.address, sbtContract.abi, provider))
    }, [])

    return(
        <SubPage theme={ Theme }>
            <HeadingText>
                Your SBT
            </HeadingText>
            <MainRow isBottom={false}>
                {
                    [
                        //sbtInfo.sbtId,
                        sbtInfo.level,
                        //sbtInfo.totalPoint,
                        //sbtInfo.vePower,
                        //sbtInfo.vePoint,
                        //sbtInfo.POC,
                        //sbtInfo.eventPoint
                    ]
                }
            </MainRow>
            
        </SubPage>
    )
}

export default SBT

