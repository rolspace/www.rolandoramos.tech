import React from "react"
import { Link } from "gatsby"
import { Flex, Box } from "@rebass/grid"
import styled from "styled-components"

import logo from "../../content/assets/logo.png"

const Logo = styled.h1`
  line-height: 1;
  margin: 0;
`

const Menu = styled.div`
  display: flex;
  margin-left: auto !important;
`

const MenuLink = styled(Link)`
  color: #adadad;
  font-family: Poppins;
  font-size: .65em;
  font-weight: 500;
  letter-spacing: .03em;
  padding: 0.3rem 0.5rem;
  text-transform: uppercase;
  text-decoration: none;
`

const Header = (props) => {
  return (
    <Flex as="header" flexDirection="row" flexWrap="nowrap" alignItems="center">
      <Box width={[1, 1/2, 2/3]}>
        <Logo>
          <Link style={{ display: `inline-block` }} to={`/`}>
            <img style={{ marginLeft: `-0.5rem`, verticalAlign: `middle` }} src={logo} width={225} alt="www.rolandoramos.tech" />
          </Link>
        </Logo>
      </Box>
      <Box style={{ display: `flex` }} width={[1, 1/2, 1/3]}>
        <Menu>
          <MenuLink to={`/posts/`}>Posts</MenuLink>
          <MenuLink to={`/about/`}>About</MenuLink>
        </Menu>
      </Box>
    </Flex>
  )
}

export default Header