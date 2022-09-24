
import React from "react"
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core"

import { Theme } from "../theme"
import { Icon } from "../component-styles"



const FooterContainer = styled.footer`
  position: fixed;
  bottom: 0;

  width: 100%;
  height: 50px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 700px) {
    display: none;
  }
`

const FooterInfo = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  width: 200px;
  height: 100%;

  border-radius: 0.3125rem;
`

const PoweredBy = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 200px;
  height: 100%;

  margin: 0;

  font-family: "Noto Sans Display", sans-serif;
  font-size: 0.9rem;
  font-weight: bold;

  color: ${ props => props.theme.colors.text };

  cursor: default;
`

const Fusion = styled.a`
  cursor: pointer;

  color: ${ props => props.theme.colors.highlight };
`

const TrackTokensButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 50px;
  height: 40px;

  margin: 0 5px;
  padding: 0;

  border: none;
  outline: 1px solid ${ props => props.theme.colors.tertiary };
  border-radius: 0.625rem;

  background-color: ${ props => props.theme.colors.main };

  box-shadow: 0 0 10px 2px ${ props => props.theme.colors.highlightFaint };

  cursor: pointer;
`


const Footer: React.FC = () => {

  const { isActive, connector, provider, chainId } = useWeb3React()

  return (
    <FooterContainer>


      {/* 
        <div style={{ display: "flex", justifyContent: "space-between", width: "540px", height: "100px", padding: "10px", background: "#ddd" }}>
          <div style={{ width: "100px", height: "100px", background: Theme.colors.main }}></div>
          <div style={{ width: "100px", height: "100px", background: Theme.colors.secondary }}></div>
          <div style={{ width: "100px", height: "100px", background: Theme.colors.tertiary }}></div>
          <div style={{ width: "100px", height: "100px", background: Theme.colors.highlight }}></div>
          <div style={{ width: "100px", height: "100px", background: Theme.colors.text }}></div>
        </div>
      */}
    </FooterContainer>
  )
}

export default Footer
