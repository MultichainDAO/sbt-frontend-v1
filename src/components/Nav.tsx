import React from "react"
import { NavLink, useLocation } from "react-router-dom"
import styled from "styled-components"

import { Theme } from "../theme"


interface TabProps {
  first: boolean,
  isSelected: boolean
}


const NavContainer = styled.nav`
  display: flex;
  justify-content: center;
  @media (max-width: 700px) {
    width: 100%;
  }
`

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  @media (max-width: 700px) {
    width: 50%;
  }
`

const Tab = styled.div<TabProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 425px;
  height: 40px;
  margin: 0 auto;
  border-top-left-radius: ${ props => props.first ? "1.25rem" : "0" };
  border-top-right-radius: ${ props => props.first ? "0" : "1.25rem" };
  font-size: 1rem;
  font-weight: ${ props => props.isSelected ? "900" : "300" };
  letter-spacing: 0.2rem;
  color: ${ props => props.isSelected ? props.theme.colors.text : props.theme.colors.secondary };
  background-color: ${ props => props.isSelected ? props.theme.colors.main : props.theme.colors.tertiary };
  opacity: ${ props => props.isSelected ? "1" : "0.9" };
  transition: font-weight 0.1s ease, background-color 0.1s ease, opacity 0.1s ease;
  &:hover {
    opacity: 1;
  }
  @media (max-width: 700px) {
    width 100%;
  }
`


const Nav: React.FC = () => {
  const location = useLocation()

  return (
    <NavContainer>
      <StyledNavLink to="/sbt"><Tab theme={ Theme } first={ true } isSelected={ location.pathname.slice(0, 4) !== "/dID" }>SBT</Tab></StyledNavLink>
      <StyledNavLink to="/dID"><Tab theme={ Theme } first={ false } isSelected={ location.pathname.slice(0, 4) === "/dID"  }>DIDs</Tab></StyledNavLink>
    </NavContainer>
  )
}

export default Nav