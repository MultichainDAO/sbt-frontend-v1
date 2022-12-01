import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { Theme } from "../theme"
import {SmallText, BigText, NormalText, Title, MainRow, NewSBTButton, RemoveSBTButton, SubTitle} from "../component-styles"

const PopUp = styled.div`
  position: fixed;
  margin: 35vh 25vw;
  width: 50vw;
  padding: 0 10px;
  border-radius: 0.5rem;
  background-color: ${props => props.theme.colors.secondary};
  z-index: 1000;

  @media (max-width: 700px) {
    width: 90%;
    margin: 35vh 5%;
    padding: 0;
  }
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
  
  @media (max-width: 700px) {
    width: 98%;
    margin: 14px 1%;
    padding: 0;
  }
`



interface MessageBoxProps {
    onClose: ()=>void,
    selectedMessage: number
}

const UserMessage:React.FC<MessageBoxProps> =  ({onClose, selectedMessage}) => {

    const [ message, setMessage ] = useState<{title: string, message: string, link: string}>({title:"", message:"", link: ""});

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

    const messages = useMemo(()=>[
        {
            id: 0,
            title: "",
            message: "",
            link: ""
        },
        {
            id: 1,
            title: "",
            message: "veMULTI delegation successful. Please wait 20 minutes for your vePower to update on your Polygon SBT",
            link: ""
        },
        {
            id: 2,
            title: "",
            message: "New SBT successfully created",
            link: ""
        },
        {
            id: 3,
            title: "",
            message: "Insufficient gas. Please add some and try again",
            link: ""
        },
        {
            id: 4,
            title: "",
            message: "You have successfully claimed your bounty",
            link: ""
        },
    ], [])

    useEffect(() => {
        setMessage(messages[selectedMessage]);
    }, [messages, selectedMessage]);

    const messageLinkDisplay = () => {
        return (
            <>
            <a href={message.link} target="_blank" rel="noreferrer"> {message.link} </a>
            </>
        )
    }

    return ReactDOM.createPortal (
        <>
          <Overlay ref={overlay}>
            <PopUp ref={modal} theme = {Theme}>
              <Title theme = {Theme}>
                {message.title}
              </Title>
              <NormalText width = {"90%"} left = {"2%"} right = {"2%"}   theme = {Theme}>
                {message.message}
              </NormalText>
              {
                message.link.length > 0
                ? messageLinkDisplay()
                : null
              }
              <Ok onClick={() => onClose()} theme = {Theme}>
                OK
              </Ok>
            </PopUp>
          </Overlay>
        </>,
        document.getElementById("helper")!
    )

}

export default UserMessage

