import React, { Fragment } from "react"
import styled from "styled-components"
import { Flex, Box } from "@rebass/grid"

import GlobalStyle from "../styles/global-styles"
import Header from "./header"

const HeaderBox = styled(Box)`
  background-color: #fff;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.2);
  line-height: 1.5;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  
  @media (min-width: 40em) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }`

class Layout extends React.Component {
  render() {
    const { children } = this.props
    
    return (
      <Fragment>
        <GlobalStyle />
        <Flex flexDirection="column" flexWrap='nowrap' alignItems='center'>
          <HeaderBox width={1}>
            <Header />
          </HeaderBox>
          <Box width={[1, 1/2]} mx='auto' mt="1.5rem" pl="0.75rem" pr="0.75rem">
            <main>{children}</main>
          </Box>
          <Box width={1}>
            <footer>
              © {new Date().getFullYear()}, Built with
              {` `}
              <a href="https://www.gatsbyjs.org">Gatsby</a>
            </footer>
          </Box>
        </Flex>
      </Fragment>
    )
  }
}

export default Layout
