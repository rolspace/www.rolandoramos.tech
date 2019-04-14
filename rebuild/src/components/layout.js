import React, { Fragment } from "react"
import { Flex, Box } from "@rebass/grid"

import GlobalStyle from "../styles/global-styles"
import Header from "./header"

class Layout extends React.Component {
  render() {
    const { children } = this.props
    
    return (
      <Fragment>
        <GlobalStyle />
        <Flex flexWrap='wrap' alignItems='center'>
          <Box width={1}>
            <Header />
          </Box>
          <Box width={[1, 1/2]} mx='auto'>
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
