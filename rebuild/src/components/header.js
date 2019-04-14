import React from "react"
import { Link } from "gatsby"
import { Flex, Box } from "@rebass/grid"
import styled from "styled-components"

import logo from "../../content/assets/logo.png"

const Wrapper = styled.header`
  line-height: 1.5;`

const Heading = styled.h1`
  margin: 0;  
  padding: 0 15px;`

const Header = (props) => {
  return (
    <Wrapper>
      <Flex flexWrap="wrap">
        <Box width={[1, 1/2, 2/3]}>
          <Heading>
            <Link to={`/`}>
              <img src={logo} width={225} alt="www.rolandoramos.tech" />
            </Link>
          </Heading>
        </Box>
        <Box width={[1, 1/2, 1/3]}>
          <div>
            <a>Item1</a>
            <a>Item2</a>
          </div>
        </Box>
      </Flex>
    </Wrapper>
  )
}

export default Header