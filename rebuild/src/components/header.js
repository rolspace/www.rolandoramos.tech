import React from "react"
import { Link } from "gatsby"
import { Flex, Box } from "@rebass/grid"
import styled from "styled-components"

import logo from "../../content/assets/logo.png"

const Logo = styled.h1`
  line-height: 1;
  margin: 0;
`

const MenuFlex = styled(Flex)`
  @media (min-width: 40em) {
    display: flex;
    margin-left: auto !important;
  }
`

const MenuLink = styled(Link)`
  color: #adadad;
  font-family: Poppins;
  font-size: .65em;
  font-weight: 500;
  letter-spacing: .03em;
  padding: 0.3rem 0;
  text-transform: uppercase;
  text-decoration: none;

  @media (min-width: 40em) {
    padding: 0.3rem 0.5rem;
  }
`

const Header = (props) => {
  return (
    <Flex as="header" flexDirection={["column", "row"]} flexWrap="nowrap" alignItems="center">
      <Box width={[1, 1/2, 2/3]}>
        <Logo>
          <Link style={{ display: `inline-block` }} to={`/`}>
            <img style={{ marginLeft: `-0.5rem`, verticalAlign: `middle` }} src={logo} width={225} alt="www.rolandoramos.tech" />
          </Link>
        </Logo>
      </Box>
      <Box style={{ display: `flex` }} width={[1, 1/2, 1/3]}>
        <MenuFlex flexDirection={["column", "row"]}>
            <Box width={1}>
              <MenuLink to={`/posts/`}>Posts</MenuLink>
            </Box>
            <Box width={1}>
              <MenuLink to={`/about/`}>About</MenuLink>
            </Box>
        </MenuFlex>
      </Box>
    </Flex>
  )
}

export default Header