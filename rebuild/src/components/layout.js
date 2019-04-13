import React, { Fragment } from "react"
import { Link } from "gatsby"
import { Flex, Box } from "@rebass/grid"

import GlobalStyle from "../styles/global-styles";

class Layout extends React.Component {
  render() {
    const { title, children } = this.props

    const header = (
      <h1 style={{ marginTop: 0, }}>
        <Link to={`/`}>{title}</Link>
      </h1>
    )
    
    return (
      <Fragment>
        <GlobalStyle />
        <Flex flexWrap='wrap' alignItems='center'>
          <Box width={1}>
            <header>{header}</header>
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
