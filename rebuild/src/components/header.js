/* eslint-disable space-infix-ops */
import { Box, Flex } from '@rebass/grid'
import { Link } from 'gatsby'
import React from 'react'
import { IconContext } from 'react-icons'
import { IoIosMenu } from 'react-icons/io'
import styled from 'styled-components'
import Logo from './styled/logo'

const MenuFlex = styled(Flex)`
  display: ${props => props.hidden ? 'none' : 'flex'};

  @media (min-width: 40em) {
    display: flex;
    margin-left: auto !important;
  }`

const MenuLink = styled(Link)`
  color: #adadad;
  font-family: Poppins;
  font-size: .65em;
  font-weight: 500;
  letter-spacing: .03em;
  text-transform: uppercase;
  text-decoration: none;

  @media (min-width: 40em) {
    padding: 0rem 0.5rem;
  }`

const MenuButton = styled.button`
  background: 0 0;
  border: none;
  margin: 0;
  outline: 0;
  padding: 0;
  position: absolute;
  right: 6px;
  top: 6px;
  touch-action: manipulation;

  @media (min-width: 52em) {
    display: none;
  }`

class Header extends React.Component {
  constructor (props) {
    super(props)

    this.state = { menuHidden: true }
    this.onMenuButtonClick = this.onMenuButtonClick.bind(this)
  }

  onMenuButtonClick () {
    this.setState({ menuHidden: !this.state.menuHidden })
  }

  render () {
    return (
      <Flex as="header" flexDirection={['column', 'row']} flexWrap="nowrap" alignItems="center">
        <Box width={[1, 1/2, 2/3]}>
          <Logo />
        </Box>
        <Box style={{ display: `flex` }} width={[1, 1/2, 1/3]}>
          <MenuFlex flexDirection={['column', 'row']} hidden={this.state.menuHidden}>
            <Box pt="0.2rem" pb="0.2rem" width={1}>
              <MenuLink to='/posts/'>Posts</MenuLink>
            </Box>
            <Box pt="0.2rem" pb="0.4rem" width={1}>
              <MenuLink to='/about/'>About</MenuLink>
            </Box>
          </MenuFlex>
        </Box>
        <MenuButton onClick={this.onMenuButtonClick}>
          <IconContext.Provider value={{ color: '#00000080', size: '3.5em' }}>
            <IoIosMenu />
          </IconContext.Provider>
        </MenuButton>
      </Flex>
    )
  }
}

export default Header
