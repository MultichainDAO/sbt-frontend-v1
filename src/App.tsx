import { useEffect, useState } from "react"
import styled, { createGlobalStyle } from "styled-components"

import { useWeb3React } from "@web3-react/core"

import Header from "./components/Header"
//import Nav from "./components/Nav"
import Footer from "./components/Footer"

import SBT from "./components/SBT"

import { Theme } from "./theme"


const GlobalStyle = createGlobalStyle`
  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    background: linear-gradient(to bottom, ${ props => props.theme.colors.secondary }, ${ props => props.theme.colors.main });
    font-size: 16px;
    font-family: "Noto Sans Display", sans-serif;
    overflow: hidden;

    @media (max-width: 800px) {
      overflow-y: scroll;
    }
  }

  * {
    &::selection {
      background-color: ${ props => props.theme.colors.highlight };
    }
  }
`
const AppContainer = styled.main`
  display: flex;
  flex-direction: column;

  width: 700px;

  margin: 0 auto;
  padding-top: 10px;

  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;

  background-color: ${ props => props.theme.colors.main };

  @media (max-width: 900px) {
    width: 100%;
  }
`

const Spacer = styled.div`
  width: 100%;
  height: 150px;

  @media (max-width: 700px) {
    height: 10px;
  }
`

const MainPage = styled.div`
  width: 720px;

  margin: 0 auto;

  outline: 1px solid ${ props => props.theme.colors.tertiary };
  border-radius: 1.25rem;

  box-shadow: 0 0 40px 0 ${ props => props.theme.colors.highlightFaint };

  @media (max-width: 900px) {
    width: 98%;
    margin: 0 1%;
  }
`

const NoConnection = styled.div`
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

const Status = styled.div`
  margin: 40px 0 0 0;
`


const App: React.FC = () => {

  const { isActive } = useWeb3React()

  return (
    <>
      <GlobalStyle theme={ Theme }/>
      <Header/>

      <Spacer/>

        <MainPage theme={ Theme }>

          {
            isActive
              ? <AppContainer theme={ Theme }>
                <SBT/>
              </AppContainer>
              : <AppContainer theme={ Theme }>
                  <NoConnection>
                    Connect Wallet to Network
                  </NoConnection>
                </AppContainer>
          }
 
          <Status id="status"></Status>

        </MainPage>
        
        <Footer/>
    </>
  )

}

export default App;
