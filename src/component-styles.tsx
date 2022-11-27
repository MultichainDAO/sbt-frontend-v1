import styled, { DefaultTheme, keyframes } from "styled-components"
import { Theme } from "./theme"


const DropDownIcon = () => <span className="material-symbols-outlined">expand_more</span>
const InfoIcon = () => <span className="material-symbols-outlined">info</span>
const ErrorIcon = () => <span className="material-symbols-outlined">error</span>
const WarningIcon = () => <span className="material-symbols-outlined">warning</span>
const CloseIcon = () => <span className="material-symbols-outlined">close</span>
const SettingsIcon = () => <span className="material-symbols-outlined">settings</span>
const ArrowIcon = () => <span className="material-symbols-outlined">arrow_outward</span>



interface InputTokenProps {
  theme: DefaultTheme,
  isSelected: boolean
}

interface ActiveElement {
  theme: DefaultTheme,
  isActive: boolean
}

interface InputAmountProps {
  theme: DefaultTheme
}

interface MainRowProps {
  theme: DefaultTheme,
  isBottom: boolean
}

interface SizeProps {
  size: string
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


const SubPage = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin: 0 auto;

  height: 200px;


  outline: 1px solid ${ props => props.theme.colors.tertiary };
  border-radius: 1.25rem;

  box-shadow: 0 0 40px 0 ${ props => props.theme.colors.highlightFaint };

`
const TitleRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    
    width: 100%
    height: 80px;
    margin 10px auto;
`

const Title = styled.div`

  width: 100%;
  height: 50px;

  margin: 0 auto;

  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 0.5rem;

  color: ${props => props.theme.colors.text};

  cursor: default;

  @media (max-width: 700px) {
    font-size: 1rem;
    letter-spacing: 0.3rem;
  }
`

const VeMultiTitle = styled.div`

  width: 100%;
  height: 30px;

  margin: 0 auto;

  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 0.5rem;

  color: ${props => props.theme.colors.text};

  cursor: default;

  @media (max-width: 700px) {
    font-size: 0.8rem;
    letter-spacing: 0.3rem;
    text-align: center;
  }
`

const SubTitle = styled.div`

  width: 100%;
  height: 20px;

  margin: 10px 10px 0;

  font-size: 0.9rem;
  font-weight: bold;
  letter-spacing: 0.15rem;

  color: ${props => props.theme.colors.text};

  cursor: default;

  @media (max-width: 700px) {
    font-size: 0.8rem;
    font-weight: normal;
    letter-spacing: 0.04rem;
  }
`

const SmallText = styled.div`

  width: 100%;
  height: 20px;

  margin: 10px 10px 0;

  font-size: 0.7rem;
  font-weight: bold;
  letter-spacing: 0.1rem;

  color: ${props => props.theme.colors.text};

  cursor: default;

  @media (max-width: 700px) {
    font-size: 0.7rem;
    letter-spacing: 0.04rem;
  }
`

const BigText = styled.div`

  width: 100%;
  height: 30px;

  margin: 10px 10px 0;

  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 0.1rem;

  color: ${props => props.theme.colors.text};

  cursor: default;

  @media (max-width: 700px) {
    font-size: 1rem;
    letter-spacing: 0.04rem;
  }
`



const NormalText = styled.div<ValueBoxProps>`
    text-align: ${props => props.align? props.align : "left"};
    width: ${props => props.width? props.width : "inherited"};
    height: ${props => props.height? props.height : "inherited"};

    margin-top: ${ props => props.top};
    margin-right: ${ props => props.right};
    margin-bottom: ${props => props.bottom};
    margin-left: ${props => props.left};

    font-family: "Source Code Pro", monospace;
    font-size: 0.9rem;
    font-weight: bold;
    overflow-wrap: break-word;
    

    color: ${props => props.theme.colors.text};

    @media (max-width: 700px) {
      font-size: 0.8rem;
      letter-spacing: 0.04rem;
      word-wrap: break-word;
    }

`


const HeadingText = styled.div`

  width: 100%;
  height: 50px;

  margin: 0 auto;

  font-family: "Source Code Pro", monospace;
  font-size: 1.4rem;
  font-weight: bold;
  letter-spacing: 0.1rem;

  @media (max-width: 700px) {
    width: 98%;
    margin: 0 1%;
  }
`

const MainRow = styled.div<MainRowProps>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  
  width: 100%;
  height: 200px;

  margin: ${props => props.isBottom ? "5px 0 10px" : "5px 0"};
`

const InfoDisplayData = styled.div`
  display: flex;
  justify-content: flex-start;

  width: 100%;

  font-family: "Source Code Pro", monospace;
  font-size: 0.9rem;
`

const NetworkRow = styled.div<MainRowProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin 0 50px;

  width: 450px;
  height: 100%;

  font-family: "Source Code Pro", monospace;
  font-size: 0.9rem;

  @media (max-width: 700px) {
    width: 90%;
    height: 100px;
    margin: 0 auto;
  }
`


const NetworkButton = styled.button<ActiveElement>`

  display: flex;
  justify-content: center;
  align-items: center;

  // padding: 6px 6px;

  width: 24%;
  height: 70%;

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


const ApproveSBTButton = styled.button<ActiveElement>`
  visibility: ${props => props.isActive ? "" : "hidden"};

  margin: 10px 5px 0 0;
  padding: 0 10px;

  width: 20%;
  height: 50px;

  border: none;
  border-radius: 0.2rem;

  font-family: "Source Code Pro", monospace;
  font-size: 1.6rem;
  font-weight: bold;
  letter-spacing: 0.08rem;

  background-color: ${props => props.theme.colors.highlight};
  color: ${props => props.theme.colors.secondary};

  cursor: pointer;

  opacity: 0.9;

  transition: opacity 0.01s ease;

  &:hover {
    opacity: 1;
  }

  @media (max-width: 700px) {
    width: 40%;
    height: 50px;
    margin: 10px 1%;
  }
`

const NewSBTButton = styled.button<ActiveElement>`
  visibility: ${props => props.isActive ? "" : "hidden"};

  margin: 10px 5px 0 0;
  padding: 0 10px;

  width: 20%;
  height: 50px;

  border: none;
  border-radius: 0.2rem;

  font-family: "Source Code Pro", monospace;
  font-size: 1.6rem;
  font-weight: bold;
  letter-spacing: 0.08rem;

  background-color: ${props => props.theme.colors.highlight};
  color: ${props => props.theme.colors.secondary};

  cursor: pointer;

  opacity: 0.9;

  transition: opacity 0.01s ease;

  &:hover {
    opacity: 1;
  }

  @media (max-width: 700px) {
    width: 40%;
    height: 50px;
    margin: 10px 1%;
  }
`

const RemoveSBTButton = styled.button<ActiveElement>`
  visibility: ${props => props.isActive ? "" : "hidden"};

  display: flex;
  justify-content: center;
  align-items: center;

  margin: 0 30px  0;
  padding: 0 0;

  width: 20%;
  height: 50px

  border: none;
  border-radius: 0.2rem;

  font-family: "Source Code Pro", monospace;
  font-size: 0.6rem;
  font-weight: bold;
  letter-spacing: 0.08rem;

  background-color: ${props => props.theme.colors.highlight};
  color: ${props => props.theme.colors.secondary};

  cursor: pointer;

  opacity: 0.9;

  transition: opacity 0.01s ease;

  &:hover {
    opacity: 1;
  }
`

const ScanForVeMULTIButton = styled.button<ActiveElement>`
  visibility: ${props => props.isActive ? "" : "hidden"};

  display: flex;
  justify-content: center;
  align-items: center;

  margin: 0 5px 0 0;
  padding: 0 10px;

  width: 100%;
  height: 100%;

  border: none;
  border-radius: 0.2rem;

  font-family: "Source Code Pro", monospace;
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 0.08rem;

  background-color: ${props => props.theme.colors.highlight};
  color: ${props => props.theme.colors.secondary};

  cursor: pointer;

  opacity: 0.9;

  transition: opacity 0.01s ease;

  &:hover {
    opacity: 1;
  }
`

// MODAL
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
`

const ModalTitle = styled.div`
  margin: 0 5px;
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 0.5rem;
  color: ${props => props.theme.colors.text};
  cursor: default;
`

const ModalClose = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
`


// ANIMATION
const bounceSmall = keyframes`
  from {
    transform: translate3d(0, 2px, 0);
  }

  to {
    transform: translate3d(0, -2px, 0);
  }
`

const ApprovalLoader = styled.span`
  display: inline-block;
  
  width: 8px;
  height: 8px;

  margin: 0 6px;

  border-radius: 50%;

  background-color: ${props => props.theme.colors.secondary};

  animation: ${bounceSmall} 0.3s infinite alternate;

  &:nth-child(2) {
    animation-delay: 0.1s;
  }

  &:nth-child(3) {
    animation-delay: 0.2s;
  }
`


// WALLET LIST
const WalletListPopUp = styled.div`
  position: fixed;
  right: 50%;
  width: 500px;
  height: 210px;
  margin: 300px -260px 0 0;
  padding: 0 10px;
  border-radius: 1.25rem;
  background-color: ${props => props.theme.colors.secondary};
  z-index: 1001;
  @media (max-width: 700px) {
    right: 0;
    width: 96%;
    margin: 100px 1%;
    padding: 0 1%;
  }
`

const WalletListTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
`

const WalletListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 98%;
  height: 60px;
  margin: 0 auto;
  padding: 0 5px;
  border-radius: 0.4rem;
  font-size: 1.1rem;
  letter-spacing: 0.1rem;
  background-color: ${ props => props.theme.colors.main };
  color: ${ props => props.theme.colors.text };
  cursor: pointer;
`

const WalletListLogo = styled.img`
  width: 50px;
  height: 50px;
`



export {
  DropDownIcon,
  InfoIcon,
  ErrorIcon,
  WarningIcon,
  CloseIcon,
  SettingsIcon,
  ArrowIcon,


  ModalOverlay,
  ModalTitle,
  ModalClose,

  SubPage, 
  TitleRow,
  Title, 
  VeMultiTitle,
  SubTitle,
  SmallText,
  BigText,
  NormalText,
  HeadingText,
  MainRow,
  InfoDisplayData,
  ApproveSBTButton,
  NewSBTButton,
  RemoveSBTButton,
  bounceSmall,
  ApprovalLoader,
  NetworkRow,
  ScanForVeMULTIButton,
  NetworkButton,

  WalletListPopUp,
  WalletListTitleRow,
  WalletListItem,
  WalletListLogo,
}