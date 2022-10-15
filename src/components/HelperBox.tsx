import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { Theme } from "../theme"
import {SmallText, BigText, NormalText, Title, RowSpacer, ColumnSpacer, MainRow, NewSBTButton, RemoveSBTButton, SubTitle} from "../component-styles"



const PopUp = styled.div`
  position: fixed;
  margin: 35vh 25vw;
  width: 50vw;
  padding: 0 10px;
  border-radius: 0.5rem;
  background-color: ${props => props.theme.colors.secondary};
  z-index: 1000;
`

const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001;
`


const Ok = styled.div`
  display: inline-block;
  width: 8vh;
  height: 4vh;
  margin: 1vh 80%;
  padding: 0 10px;

 

  border: none;
  border-radius: 0.2rem;

  font-family: "Source Code Pro", monospace;
  font-size: 1.6rem;
  font-weight: bold;
  letter-spacing: 0.08rem;
  text-align: center;

  background-color: ${props => props.theme.colors.highlight};
  color: ${props => props.theme.colors.secondary};

  cursor: pointer;

  opacity: 0.9;

  transition: opacity 0.01s ease;

  &:hover {
    opacity: 1;
  }
  
`



interface HelperBoxProps {
    onClose: ()=>void,
    selectedHelper: number
}

const HelperBox:React.FC<HelperBoxProps> =  ({onClose, selectedHelper}) => {

    const [ helper, setHelper ] = useState<{title: string, message: string, link: string}>({title:"", message:"", link: ""});

    const overlay = useRef<HTMLDivElement>(null);
    const modal = useRef<HTMLDivElement>(null);
  
    const exitModal = useCallback((e: { target: any; }) => {
      if(overlay?.current?.contains(e.target) && !modal?.current?.contains(e.target)) {
        onClose();
      }
    },[onClose])
  
    useEffect(() => {
      document.addEventListener("mousedown", exitModal);
      
      return () => {
        document.removeEventListener("mousedown", exitModal);
      }
    }, [exitModal]);
  
    const helpers = useMemo(()=>[
        {
            id: 0,
            title: "",
            message: "",
            link: ""
        },
        {
            id: 1,
            title: "SBT Definition",
            message: "A Soul Bound Token is an NFT that is bound to your wallet address. The MultiDAO SBT records your contribution to Multichain. It is not transferable to another wallet and you may only have one of these. In this interface, you can create your own SBT and then you can attach your veMULTI to it to gain Voting Power",
            link: "https://multidao.gitbook.io/multidao/the-multidao/multi-sbt"
        },
        {
            id: 2,
            title: "VEPower Definition",
            message: "VEPower is derived from how many MULTI you have staked in all the veMULTI that you have delegated (attached) to this SBT. It is proportional to the remaining time the MULTI are locked for in their respective veMULTI NFT.",
            link: "https://multidao.gitbook.io/multidao/the-multidao/vemulti#vepower"
        },
        {
            id: 3,
            title: "VEPoints Definition",
            message: "Your VEPoints are calculated from your VEPower using the following formula :      VEPoints=250*log2(VEPower)+514*VEPower      The intention is to weight the Voting Power appropriately, so that MULTI whales do not have undue power to swing votes",
            link: "https://multidao.gitbook.io/multidao/the-multidao/multi-sbt/sbt-point-calculation#ve-power-ve-point-sbt-point"
        },
        {
            id: 4,
            title: "POC Definition",
            message: "Your Proof of Contribution, or POC is awarded to you for tasks you have completed. POC translates directly into USD rewards that you can claim in this interface. Your POC is reset to zero at the end of the Epoch, reducing your Voting Power, but you can still claim the rewards for your work afterwards",
            link: "https://multidao.gitbook.io/multidao/the-multidao/poc-how-to-earn-bounties#introduction"
        },
        {
            id: 5,
            title: "Event Points Definition",
            message: "Event Points may be awarded to you for attending selected Multichain events. These could be AMA's or other online or real meetings. The points translate directly into USD rewards that you can claim in this interface. Your Event Points are reset to zero at the end of the Epoch, reducing your Voting Power, but you can still claim the rewards afterwards",
            link: ""
        },
        {
            id: 6,
            title: "Vote Power Definition",
            message: "Your Vote Power (or SBT Points) is the number of votes you have for voting on MultiDAO proposals. It is the weighted sum of your VEPoints, POC and Event Points",
            link: "https://multidao.gitbook.io/multidao/the-multidao/multi-sbt/sbt-point-calculation#sbt-point"
        },
        {
            id: 7,
            title: "Vote Level",
            message: "Your Level is determined by your Vote Power (or number of SBT Points you have). Bronze > 1000, Silver > 5000, Gold > 30000, Platinum > 100000, Diamond > 200000",
            link: "https://multidao.gitbook.io/multidao/the-multidao/multi-sbt/sbt-point-calculation#levels"
        },
        {
            id: 8,
            title: "Epoch Definition",
            message: "The Epoch is a 12 week period during which you can accumulate POC and Event Points. At the end of the Epoch, these are reset to zero, though you may still claim your rewards afterwards. The Epoch Number is the integer number of 12 week periods since the start of Linux Time (1970-01-01:00:00:00)",
            link: "https://multidao.gitbook.io/multidao/the-multidao/multi-sbt/epochs"
        },
        {
            id: 9,
            title: "veMULTI Definition",
            message: "The veMULTI is an NFT into which you have locked your MULTI tokens for a period of up to 4 years. Ownership of veMULTI confers you with a proportion of the Multichain fees and by delegating your veMULTI to your SBT (which you can do here), you increase your governance Voting Power (or SBT Points). You can create veMULTI tokens on either Ethereum, Fantom or BNB Chain and you may have multiple veMULTI tokens on each of these chains. They can all be delegated from this interface to your SBT",
            link: "https://multidao.gitbook.io/multidao/the-multidao/vemulti"
        }
    ], [])

    useEffect(() => {
        setHelper(helpers[selectedHelper]);
    }, [helpers, selectedHelper]);

    const helperLinkDisplay = () => {
        return (
            <>
            <a href={helper.link} target="_blank" rel="noreferrer">More information here</a>
            </>
        )
    }
    

    return ReactDOM.createPortal(
        <>
          <Overlay ref={overlay}>
            <PopUp ref={modal} theme = {Theme}>
              <Title theme = {Theme}>
                {helper.title}
              </Title>
              <RowSpacer size = {"10px"}/>
              <NormalText theme = {Theme}>
                {helper.message}
              </NormalText>
              <RowSpacer size = {"10px"}/>
              {
                helper.link.length > 0
                ? helperLinkDisplay()
                : null
              }
              <RowSpacer size = {"10px"}/>
              <Ok onClick={() => onClose()} theme = {Theme}>
                OK
              </Ok>
            </PopUp>
          </Overlay>
        </>,
        document.getElementById("helper")!);

}

export default HelperBox
