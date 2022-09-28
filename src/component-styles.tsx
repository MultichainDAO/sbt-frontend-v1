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


const SubPage = styled.div`
  margin: 0 auto;

  outline: 1px solid ${ props => props.theme.colors.tertiary };
  border-radius: 1.25rem;

  box-shadow: 0 0 40px 0 ${ props => props.theme.colors.highlightFaint };

  @media (max-width: 700px) {
    width: 90%;
    margin: 0 1%;
  }
`


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

const SubTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;

  width: 100%;
  height: 20px;

  margin: 10px 10px 0;

  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 0.5rem;

  color: ${props => props.theme.colors.text};

  cursor: default;
`

const RowSpacer = styled.div<SizeProps>`
  width: 100%;
  height: ${props => props.size};
`

const HeadingText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

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

  width: 100%
  height: 100%;

  font-family: "Source Code Pro", monospace;
  font-size: 0.9rem;
`


const NetworkButton = styled.button<ActiveElement>`

  display: flex;
  justify-content: center;
  align-items: center;

  margin: 0 5px 0 0;
  padding: 6px 6px;

  width: 80%;
  height: 100%;

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


const NewSBTButton = styled.button<ActiveElement>`
  visibility: ${props => props.isActive ? "" : "hidden"};

  display: flex;
  justify-content: center;
  align-items: center;

  margin: 10px 5px 0 0;
  padding: 0 10px;

  width: 100%;
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
`

const RemoveSBTButton = styled.button<ActiveElement>`
  visibility: ${props => props.isActive ? "" : "hidden"};

  display: flex;
  justify-content: center;
  align-items: center;

  margin: 0 5px 0 0;
  padding: 0 10px;

  width: 80%;
  height: 50%;

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
export {
  SubPage, 
  Title, 
  SubTitle,
  RowSpacer,
  HeadingText,
  MainRow,
  InfoDisplayData,
  NewSBTButton,
  RemoveSBTButton,
  bounceSmall,
  ApprovalLoader,
  NetworkRow,
  ScanForVeMULTIButton,
  NetworkButton
}