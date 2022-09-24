
import styled, { DefaultTheme, keyframes } from "styled-components"
import { Theme } from "./theme"


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


const DropDownIcon = () => <span className="material-symbols-outlined">expand_more</span>
const InfoIcon = () => <span className="material-symbols-outlined">info</span>
const ErrorIcon = () => <span className="material-symbols-outlined">error</span>
const WarningIcon = () => <span className="material-symbols-outlined">warning</span>
const CloseIcon = () => <span className="material-symbols-outlined">close</span>
const SettingsIcon = () => <span className="material-symbols-outlined">settings</span>
const ArrowIcon = () => <span className="material-symbols-outlined">arrow_outward</span>


const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 20px;

  margin: 10px 0 0;

  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 0.5rem;

  color: ${props => props.theme.colors.text};

  cursor: default;
`

const MainRow = styled.div<MainRowProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  
  width: 100%;
  height: 50px;

  margin: ${props => props.isBottom ? "5px 0 10px" : "5px 0"};
`

const BottomRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 50px;

  margin: 20px 0 10px;
`

const InputToken = styled.button<InputTokenProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 30%;
  height: 100%;

  margin: 0 5px 0 0;
  padding: 0 2px;

  border: none;
  outline: 2px solid ${props => props.theme.colors.tertiary};
  border-radius: 0.4rem;

  font-family: ${props => props.isSelected ? "Source Code Pro, monospace" : "Noto Sans Display, sans-serif"};
  font-size: ${props => props.isSelected ? "1.1rem" : "1rem"};
  font-weight: bold;
  letter-spacing: ${props => props.isSelected ? "0.08rem;" : "0.15rem"};

  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.text};

  cursor: pointer;

  @media (max-width: 700px) {
    padding: 0;
    font-size: 1rem;
  }
`

const InputAmount = styled.input<InputAmountProps>`
  width: 60%;
  height: 100%;

  margin: 0 0 0 5px;
  padding: 0 10px;

  outline: 0px solid ${props => props.theme.colors.secondary};
  border: none;
  border-radius: 0.4rem;

  font-family: "Source Code Pro", monospace;
  font-size: 1.2rem;

  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.text};

  transition: outline 0.01s ease;

  &:hover {
    outline: 2px solid ${props => props.theme.colors.tertiary};
  }
`

const InputAmountPlaceholder = styled.div`
  display: flex;
  justify-content: space-between;

  width: 320px;
  height: 100%;

  margin: 0 0 0 5px;

  outline: none
  border: none;

  @media (max-width: 700px) {
    width: 64.5%;
    justify-content: flex-end;
  }
`

const BalanceRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 20px;

  margin: 2px 0 0;
`

const ApproveButton = styled.button<ActiveElement>`
  visibility: ${props => props.isActive ? "" : "hidden"};

  display: flex;
  justify-content: center;
  align-items: center;

  margin: 0 5px 0 0;
  padding: 0 10px;

  width: 30%;
  height: 100%;

  border: none;
  border-radius: 0.2rem;

  font-family: "Source Code Pro", monospace;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 0.08rem;

  background-color: ${props => props.theme.colors.highlight};
  color: ${props => props.theme.colors.text};

  cursor: pointer;

  opacity: 0.9;

  transition: opacity 0.01s ease;

  &:hover {
    opacity: 1;
  }
`

const TokenBalance = styled.div<ActiveElement>`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  width: 60%;
  height: 100%;

  margin: 0 0 0 25px;

  font-family: "Source Code Pro", monospace;
  font-size: 0.8rem;

  color: ${props => props.theme.colors.text};
`

const SwitchFields = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 25px;
  height: 25px;

  margin: 0 auto;
  padding: 0;

  outline: none;
  border: none;
  border-radius: 0.4rem;

  background-color: ${props => props.theme.colors.tertiary};
  color: ${props => props.theme.colors.text};

  cursor: pointer;

  opacity: 0.9;

  transition: opacity 0.1s ease;

  &:hover {
    opacity: 1;
  }
`

const RowSpacer = styled.div<SizeProps>`
  width: 100%;
  height: 5px;
`

const SettingsSpacer = styled.div`
  display: flex;
  justify-content: flex-start;

  width: 30%;
  height: 50px;

  margin: 0 5px 0 0;
  padding: 0 10px;
`

const ConfirmSpacer = styled.div`
  display: flex;
  justify-content: flex-end;

  width: 60%;
  height: 50px;

  margin: 0 0 0 5px;
  padding: 0 10px;
`

const SettingsButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 50px;
  height: 50px;

  border: none;
  border-radius: 0.5rem;

  background-color: ${props => props.theme.colors.tertiary};
  color: ${props => props.theme.colors.text};

  opacity: 0.9;

  cursor: pointer;

  transition: opacity 0.1s ease;

  &:hover {
    opacity: 1;
  }
`

const ConfirmButton = styled.button<ActiveElement>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 250px;
  height: 50px;

  border: none;
  border-radius: 1rem;

  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 0.15rem;

  background: ${props => props.theme.colors.highlight};
  color: ${props => props.theme.colors.text};

  box-shadow: 0;

  opacity: ${props => props.isActive ? "0.9" : "0.6"};

  cursor: ${props => props.isActive ? "pointer" : "default"};

  transition: opacity 0.1s ease, box-shadow 0.1s ease;

  &:hover {
    box-shadow: ${props => props.isActive ? `0 0 10px 1px ${props.theme.colors.highlightFaint}` : "0"};
    opacity: ${props => props.isActive ? "1" : "0.6"};
  }
`

const RemoveButton = styled.button<ActiveElement>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 250px;
  height: 50px;

  border: none;
  border-radius: 1rem;

  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 0.15rem;

  background: ${props => props.theme.colors.highlight};
  color: ${props => props.theme.colors.text};

  box-shadow: 0;

  opacity: ${props => props.isActive ? "0.9" : "0.6"};

  cursor: ${props => props.isActive ? "pointer" : "default"};

  transition: opacity 0.1s ease, box-shadow 0.1s ease;

  &:hover {
    box-shadow: ${props => props.isActive ? `0 0 10px 1px ${props.theme.colors.highlightFaint}` : "0"};
    opacity: ${props => props.isActive ? "1" : "0.6"};
  }

  @media (max-width: 700px) {
    width: 40%;
    margin: 0 5px;
  }
`

const InfoDisplay = styled.div<ActiveElement>`
  display: ${props => props.isActive ? "flex" : "none"};
  flex-direction: column;

  width: 480px;

  margin: 0 auto;
  padding: 4px 0 10px;

  border-radius: 1rem;

  background-color: ${props => props.theme.colors.main};

  @media (max-width: 700px) {
    width: 95%;
    padding: 10px 2.5%;
  }
`

const InfoDisplayContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 480px;

  border-radius: 0.5rem;

  background-color: ${props => props.theme.colors.tertiary};

  @media (max-width: 700px) {
    width: 100%;
  }
`

const InfoDisplayRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  height: 33px;

  padding: 0 10px;

  border-radius: 0.5rem;

  background-color: ${props => props.theme.colors.tertiary};
  color: ${props => props.theme.colors.text};
`

const InfoDisplayKey = styled.div`
  width: 50%;

  font-size: 1rem;
`

const InfoDisplayData = styled.div`
  display: flex;
  justify-content: flex-end;

  width: 50%;

  font-family: "Source Code Pro", monospace;
  font-size: 1rem;
`

const LPBalanceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 450px;
  height: 20px;

  margin: 0 0 0 10px;
  padding: 0 10px;

  font-size: 0.9rem;

  letter-spacing: 0.1rem;

  @media (max-width: 700px) {
    width: calc(95% - 3px);
    margin: 0 auto;
  }
`

const LPBalanceList = styled.ul`
  list-style-type: none;

  width: 100%;
  max-height: 312px;

  margin: 0 0 10px;
  padding: 0;

  overflow-x: hidden;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 10px;
    margin: 0 10px 0 0;
  }

  &::-webkit-scrollbar-track {
    background-color: ${props => props.theme.colors.secondary};
    border-radius: 1rem;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.colors.highlight};
    border-radius: 1rem;
  }
`

const LPBalanceItem = styled.li<ActiveElement>`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 450px;
  height: 40px;

  margin: 2px 0 2px 10px;
  padding: 10px;

  border: none;
  outline: ${props => props.isActive ? `2px solid ${props.theme.colors.tertiary}` : `0px solid ${props.theme.colors.tertiary}`};
  border-radius: 0.4rem;

  font-family: "Source Code Pro", monospace;
  font-size: 1.05rem;

  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.text};

  cursor: pointer;

  transition: outline 0.02s ease;

  &:hover {
    outline: 2px solid ${props => props.theme.colors.tertiary};
  }

  @media (max-width: 700px) {
    width: calc(95% - 3px);
    margin: 2px auto;
  }
`

const LPBalanceSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 30%;
  height: 100%;

  &:nth-child(1) {
    justify-content: flex-start;
  }

  &:nth-child(3) {
    justify-content: flex-end;
  }
`

const LPBalanceItemLoading = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 450px;
  height: 40px;

  margin: 2px 0 2px 10px;
  padding: 10px;

  border: none;
  outline: none;
  border-radius: 0.4rem;

  background-color: ${props => props.theme.colors.secondary};
  
  cursor: default;

  transition: outline 0.02s ease;

  @media (max-width: 700px) {
    width: calc(95% - 3px);
  }
`

const NoLPBalances = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 450px;
  height: 40px;

  margin: 2px 0 2px 10px;
  padding: 10px;

  border: none;
  outline: none;
  border-radius: 0.4rem;

  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 0.1rem;

  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.text};

  cursor: default;

  @media (max-width: 700px) {
    width: calc(95% - 3px);
  }
`

const LPBalanceSearch = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 350px;
  height: 40px;

  margin: 5px;
  padding: 0 2px;

  border: none;
  border-radius: 1rem;

  font-size: 0.9rem;
  font-weight: bold;
  letter-spacing: 0.1rem;

  background-color: ${props => props.theme.colors.highlight};
  color: ${props => props.theme.colors.text};

  opacity: 0.9;

  cursor: pointer;

  transition: opacity 0.1s ease, box-shadow 0.1s ease;

  &:hover {
    box-shadow: 0 0 10px 1px ${props => props.theme.colors.highlightFaint};
    opacity: 1;
  }

  @media (max-width: 700px) {
    width: 98%;
    margin: 5px 1%;
  }

`

const LiquidityTabRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-item: center;

  width: 100%;
`

const LiquidityTabButton = styled.button<ActiveElement>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 142.667px;
  height: 40px;

  margin: 10px;
  padding: 0 2px;

  border: none;
  border-radius: 1rem;

  font-size: 0.9rem;
  font-weight: bold;
  letter-spacing: 0.1rem;

  background-color: ${props => props.theme.colors.highlight};
  color: ${props => props.theme.colors.text};

  opacity: ${props => props.isActive ? "0.9" : "0.6"};

  cursor: ${props => props.isActive ? "pointer" : "default"};

  transition: opacity 0.1s ease, box-shadow 0.1s ease;

  &:hover {
    box-shadow: ${props => props.isActive ? `0 0 10px 1px ${props.theme.colors.highlightFaint}` : "0"};
    opacity: ${props => props.isActive ? "1" : "0.6"};
  }

  @media (max-width: 700px) {
    width: 98%;
    margin: 5px 1%;
  }
`

const LiquidityTypeRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 95%;

  margin: 20px auto 10px;
`

const LiquidityTypeTab = styled.div<ActiveElement>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 33.33%;
  height: 25px;

  border: none;
  outline: 2px solid ${props => props.theme.colors.tertiary};

  font-size: 0.85rem;
  font-weight: ${props => props.isActive ? "900" : "300"};
  letter-spacing: 0.25rem;

  background-color: ${props => props.isActive ? props.theme.colors.main : props.theme.colors.tertiary};
  color: ${props => props.theme.colors.text};
  
  opacity: ${props => props.isActive ? "1" : "0.9"};
  
  transition: font-weight 0.1s ease, background-color 0.1s ease, opacity 0.1s ease;

  cursor: ${props => props.isActive ? "default" : "pointer"};

  &:hover {
    opacity: 1;
  }

  &:nth-child(1) {
    border-top-left-radius: 0.4rem;
    border-bottom-left-radius: 0.4rem;
  }

  &:nth-child(3) {
    border-top-right-radius: 0.4rem;
    border-bottom-right-radius: 0.4rem;
  }
`

const Icon = styled.img<SizeProps>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;

  margin: 0 5px;

  @media (max-width: 700px) {
    margin: 0 1%;
  }
`

const LPBurnDate = styled.div`
  width: 90%;
  height: 100%;

  margin: 0;
  padding: 0 15px;

  border: none;
  outline: 2px solid ${props => props.theme.colors.tertiary};
  border-radius: 0.4rem;

  font-size: 1rem;
  font-weight: bold;

  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.text};

  // &::-webkit-datetime-edit { padding: 1em; }
  // &::-webkit-datetime-edit-fields-wrapper { background: silver; }
  // &::-webkit-datetime-edit-month-field { color: blue; }
  // &::-webkit-datetime-edit-day-field { color: green; }
  // &::-webkit-datetime-edit-year-field { color: purple; }
  // &::-webkit-inner-spin-button { display: none; }
  // &::-webkit-calendar-picker-indicator { background: orange; }
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

const bounceBig = keyframes`
  from {
    transform: translate3d(0, 3px, 0);
  }

  to {
    transform: translate3d(0, -3px, 0);
  }
`

const ApprovalLoader = styled.span`
  display: inline-block;
  
  width: 6px;
  height: 6px;

  margin: 0 6px;

  border-radius: 50%;

  background-color: ${props => props.theme.colors.text};

  animation: ${bounceSmall} 0.3s infinite alternate;

  &:nth-child(2) {
    animation-delay: 0.1s;
  }

  &:nth-child(3) {
    animation-delay: 0.2s;
  }
`

const ConfirmLoader = styled.span`
  display: inline-block;

  width: 9px;
  height: 9px;

  margin: 0 9px;

  border-radius: 50%;

  background-color: ${props => props.theme.colors.text};

  animation: ${bounceBig} 0.6s infinite alternate;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
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




// PICKER
const PickerPopUp = styled.div`
  position: fixed;

  right: 50%;

  width: 400px;
  height: 730px;

  margin: 120px -210px 0 0;
  padding: 0 10px;

  border-radius: 1.25rem;

  background-color: ${props => props.theme.colors.secondary};

  z-index: 1001;

  @media (max-width: 700px) {
    right: 0;
    width: 98%;
    height: 80%;
    margin: 60px 1%;
    padding: 0;
    overflow-y: scroll;
  }
`

const PickerRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  height: 50px;
`

const PickerSearch = styled.input`
  width: 100%;
  height: 50px;

  padding: 0 10px;

  outline: 0px solid ${props => props.theme.colors.tertiary};
  border: none;
  border-radius: 0.4rem;

  font-size: 1.2rem;

  background-color: ${props => props.theme.colors.main};
  color: ${props => props.theme.colors.text};

  transition: outline 0.02s ease;

  &:hover {
    outline: 2px solid ${props => props.theme.colors.tertiary};
  }

  @media (max-width: 700px) {
    width: 96%;
    margin: 0 auto;
    padding: 0 1%;
  }
`

const PickerOptionsList = styled.ul<ActiveElement>`
  list-style: none;

  width: 100%;
  height: 576px;

  margin: 10px 0;
  padding: 0;

  outline: 0px solid ${props => props.theme.colors.tertiary};
  border-radius: 0.4rem;

  overflow-y: scroll;

  transition: outline 0.02s ease;

  &:hover {
    outline: 2px solid ${props => props.isActive ? props.theme.colors.tertiary : "none"};
  }

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.colors.highlight};
    border-radius: 1rem;
  }

  @media (max-width: 700px) {
    width: 98%;
    height: 100%;
    margin: 10px auto;
    padding: 0;
  }
`

const PickerOption = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  height: 96px;

  margin: 0;
  padding: 0;

  font-family: "Source Code Pro", monospace;
  font-size: 1.2rem;

  background-color: ${props => props.theme.colors.main};
  color: ${props => props.theme.colors.text};

  cursor: pointer;

  transition: background-color 0.05s ease;

  &:hover {
    background-color: ${props => props.theme.colors.tertiary};
  }
`

const PickerText = styled.div`
  margin: 0 10px;
`

const PickerTokenTypeRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;

  margin: 10px auto;
`

const PickerTokenTypeTab = styled.div<ActiveElement>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 33.33%;
  height: 25px;

  border: none;
  outline: 2px solid ${props => props.theme.colors.tertiary};

  font-size: 0.85rem;
  font-weight: ${props => props.isActive ? "900" : "300"};
  letter-spacing: 0.25rem;

  background-color: ${props => props.isActive ? props.theme.colors.main : props.theme.colors.tertiary};
  color: ${props => props.theme.colors.text};
  
  opacity: ${props => props.isActive ? "1" : "0.9"};
  
  transition: font-weight 0.1s ease, background-color 0.1s ease, opacity 0.1s ease;

  cursor: ${props => props.isActive ? "default" : "pointer"};

  &:hover {
    opacity: 1;
  }

  &:nth-child(1) {
    border-top-left-radius: 0.4rem;
    border-bottom-left-radius: 0.4rem;
  }

  &:nth-child(3) {
    border-top-right-radius: 0.4rem;
    border-bottom-right-radius: 0.4rem;
  }
`

const PickerTokenListLoading = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100%;

  border: none;
  outline: none;
  border-radius: 0.4rem;

  background-color: ${props => props.theme.colors.secondary};
  
  cursor: default;

  transition: outline 0.02s ease;

  @media (max-width: 700px) {
    width: calc(95% - 3px);
  }
`





// TX CONFIG
const TxConfigPopUp = styled.div`
  position: fixed;

  right: 50%;

  width: 500px;
  height: 400px;

  margin: 250px -260px 0 0;
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

const TxConfigRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  height: 80px;
`

const TxConfigKey = styled.div`
  width: 30%;

  font-size: 1rem;
`

const TxConfigOptionTray = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 70%;
  height: 100%;
`

const TxConfigOptionPreset = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 60px;
  height: 40px;

  margin: 0;
  padding: 0;

  border: none;
  border-radius: 0.4rem;

  font-size: 0.9rem;

  background-color: ${props => props.theme.colors.tertiary};
  color: ${props => props.theme.colors.text};

  opacity: 0.9;

  cursor: pointer;

  transition: opacity 0.05s ease;

  &:hover {
    opacity: 1;
  }
`

const TxConfigOptionCustom = styled.input`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100px;
  height: 40px;

  margin: 0;
  padding: 0 10px;

  outline: 0px solid ${props => props.theme.colors.tertiary};
  border: none;
  border-radius: 0.4rem;

  background-color: ${props => props.theme.colors.main};
  color: ${props => props.theme.colors.text};

  &:hover {
    outline: 2px solid ${props => props.theme.colors.tertiary};
  }

  @media (max-width: 700px) {
    width: 50px;
    padding: 0 5px;
  }
`

const TxConfigConfirmSpacer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 80px;
`

const TxConfigConfirmButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 250px;
  height: 50px;

  border: none;
  border-radius: 1rem;

  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 0.15rem;

  background-color: ${props => props.theme.colors.highlight};
  color: ${props => props.theme.colors.text};

  box-shadow: 0;

  opacity: 0.9;

  cursor: pointer;

  transition: opacity 0.1s ease, box-shadow 0.1s ease;

  &:hover {
    box-shadow: 0 0 10px 1px ${props => props.theme.colors.highlightFaint};
    opacity: 1;
  }
`




// STATUS MESSAGE
const StatusPopUp = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  position: fixed;

  right: 50%;

  width: 600px;

  margin: 350px -310px 0 0;
  padding: 10px;

  border-radius: 1.25rem;

  background-color: ${props => props.theme.colors.secondary};

  z-index: 1001;

  @media (max-width: 700px) {
    left: 0;
    width: 94%;
    margin: 300px 1%;
  }
`

const StatusContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 560px;
  min-height: 40px;
`

const StatusClose = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  width: 40px;
  min-height: 40px;
`

const StatusSymbol = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 25px;
  height: 25px;

  margin: 5px;

  cursor: default;
`

const StatusError = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;

  margin: 0;
  padding: 10px;

  outline: 1px solid crimson;
  border-radius: 0.6rem;

  font-size: 1.2rem;
  text-align: center;

  background-color: rgba(220, 20, 60, 0.2);
  color: ${props => props.theme.colors.text};
`

const StatusWarning = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;

  margin: 0;
  padding: 10px;

  outline: 1px solid gold;
  border-radius: 0.6rem;

  font-size: 1.2rem;
  text-align: center;

  background-color: rgba(255, 215, 0, 0.2);
  color: ${props => props.theme.colors.text};
`

const StatusSuccess = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;

  margin: 0;
  padding: 10px;

  outline: 1px solid cyan;
  border-radius: 0.6rem;

  font-size: 1.2rem;
  text-align: center;

  background-color: rgba(0, 255, 255, 0.2);
  color: ${props => props.theme.colors.text};
`

const StatusLink = styled.a`
  text-decoration: none;

  width: 25px;
  height: 25px;

  color: ${props => props.theme.colors.text};

  cursor: pointer;
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

  Title,
  MainRow,
  BottomRow,
  InputToken,
  InputAmount,
  InputAmountPlaceholder,
  BalanceRow,
  ApproveButton,
  TokenBalance,
  SwitchFields,
  RowSpacer,
  SettingsSpacer,
  ConfirmSpacer,
  SettingsButton,
  ConfirmButton,
  RemoveButton,
  InfoDisplay,
  InfoDisplayContainer,
  InfoDisplayRow,
  InfoDisplayKey,
  InfoDisplayData,
  LPBalanceHeader,
  LPBalanceList,
  LPBalanceItem,
  LPBalanceSection,
  LPBalanceItemLoading,
  NoLPBalances,
  LPBalanceSearch,
  LiquidityTabRow,
  LiquidityTabButton,
  LiquidityTypeRow,
  LiquidityTypeTab,
  Icon,
  LPBurnDate,

  ApprovalLoader,
  ConfirmLoader,

  ModalOverlay,
  ModalTitle,
  ModalClose,

  PickerPopUp,
  PickerRow,
  PickerSearch,
  PickerOptionsList,
  PickerOption,
  PickerText,
  PickerTokenTypeRow,
  PickerTokenTypeTab,
  PickerTokenListLoading,

  TxConfigPopUp,
  TxConfigRow,
  TxConfigKey,
  TxConfigOptionTray,
  TxConfigOptionPreset,
  TxConfigOptionCustom,
  TxConfigConfirmSpacer,
  TxConfigConfirmButton,

  StatusPopUp,
  StatusContent,
  StatusClose,
  StatusSymbol,
  StatusError,
  StatusWarning,
  StatusSuccess,
  StatusLink,

  WalletListPopUp,
  WalletListTitleRow,
  WalletListItem,
  WalletListLogo,
}
