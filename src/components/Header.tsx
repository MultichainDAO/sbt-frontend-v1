
import React from "react"
import styled from "styled-components"

import multiDAO from "../images/MultiDAO.png"

import Connect from "./Connect"

import { Theme } from "../theme"


const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;

  height: 60px;
  margin: 5px;

  @media (max-width: 700px) {
    flex-direction: column;
    height: 150px;
    margin: 0;
  }
`

const TitleContainer = styled.div`
  display: flex;
  align-items: center;

  @media (min-width: 701px) {
    width: 600px;
  }

  @media (max-width: 700px) {
    justify-content: space-between;
    height: 75px;
    margin: 0 5px;
  }
`

const MultiDAOIcon = styled.img`
  width: 100px;
  height: 100px;

  margin: 5px 15px;

  @media (max-width: 700px) {
    width: 30px;
    height: 30px;
    margin: 0 5px;
  }
`

const Title = styled.div`
  display: flex;
  align-items: center;

  margin: 0 5px 0 25px;

  font-size: 1.6rem;
  font-weight: 300;
  letter-spacing: 0.5rem;

  color: ${ props => props.theme.colors.text };

  cursor: default;

  @media (max-width: 700px) {
    font-size: 1.4rem;
    margin: 0 10px;
    text-align: center;
  }
`

const Subtitle = styled.div`
  display: flex;
  align-items: flex-end;

  height: 32px;

  margin: 0;

  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 0.3rem;

  color: ${ props => props.theme.colors.highlight };

  cursor: default;

  @media (max-width: 700px) {
    height: 25px;
    font-size: 1rem;
  }
`


const Header: React.FC = () => {
  return (
    <HeaderContainer theme={ Theme }>
      <TitleContainer>
        <MultiDAOIcon src={ multiDAO } alt="Multichain"/>
        <Title theme={ Theme }>Soul Bound Token</Title>
        <Subtitle theme={ Theme }>BETA</Subtitle>
      </TitleContainer>
      <Connect/>
    </HeaderContainer>
  )
}

export default Header
