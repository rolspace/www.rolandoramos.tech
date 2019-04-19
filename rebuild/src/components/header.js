import React from "react"
import { Link } from "gatsby"
import { Flex, Box } from "@rebass/grid"
import styled from "styled-components"

import logo from "../../content/assets/logo.png"

const Wrapper = styled.header`
  line-height: 1.5;`

const Logo = styled.h1`
  margin: 0;  
  padding: 0 15px;`

const StyledBox = styled(Box)`
  display: flex;
`

const Menu = styled.div`
  display: flex;
  margin-left: auto !important;
`

const MenuLink = styled(Link)`
`

const Header = (props) => {
  return (
    <Wrapper>
      <Flex flexWrap="wrap">
        <Box width={[1, 1/2, 2/3]}>
          <Logo>
            <Link to={`/`}>
              <img src={logo} width={225} alt="www.rolandoramos.tech" />
            </Link>
          </Logo>
        </Box>
        <StyledBox width={[1, 1/2, 1/3]}>
          <Menu>
            <MenuLink to={`/posts/`}>Posts</MenuLink>
            <MenuLink to={`/about/`}>About</MenuLink>
          </Menu>
        </StyledBox>
      </Flex>
    </Wrapper>
  )
}

export default Header