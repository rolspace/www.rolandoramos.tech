/* eslint-disable space-infix-ops */
import { Box, Flex } from '@rebass/grid'
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import styled from 'styled-components'
import GlobalStyle from '../styles/global-styles'
import Footer from './footer'
import Header from './header'
import SocialSticky from './social-sticky'

const HeaderBox = styled(Box)`
  background-color: #fff;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.2);
  line-height: 1.5;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  position: fixed;
  top: 0;
  z-index: 1000;

  @media (min-width: 40em) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
`

class Layout extends React.Component {
  render () {
    const { children } = this.props

    return (
      <Fragment>
        <GlobalStyle />
        <SocialSticky />
        <Flex flexDirection='column' flexWrap='nowrap' alignItems='center' css={{ height: "100%" }}>
          <HeaderBox width={1} flex='0 1 auto'>
            <Header location={this.props.location} />
          </HeaderBox>
          <Box
            flex='1 1 auto'
            mx='auto'
            mt='4.0rem'
            pl='0.75rem'
            pr='0.75rem'
            width={[1, 1 / 2]}
          >
            <main>{children}</main>
          </Box>
          <Box width={1} flex='0 1 auto'>
            <Footer></Footer>
          </Box>
        </Flex>
      </Fragment>
    )
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
}

export default Layout
