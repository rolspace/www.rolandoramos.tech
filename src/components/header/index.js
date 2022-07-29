/* eslint-disable space-infix-ops */
import { Box, Flex } from '@rebass/grid'
import PropTypes from 'prop-types'
import React from 'react'
import { IconContext } from 'react-icons'
import { IoIosMenu } from 'react-icons/io'
import Logo from './lib/logo'
import Menu from './lib/menu'
import MenuButton from './lib/menu-button'
import MenuLink from './lib/menu-link'

class Header extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      menuHidden: true,
    }

    this.onMenuButtonClick = this.onMenuButtonClick.bind(this)
  }

  onMenuButtonClick() {
    this.setState({ menuHidden: !this.state.menuHidden })
  }

  render() {
    const { location } = this.props
    const postsActive = location && location.pathname === '/posts/'
    const aboutActive = location && location.pathname === '/about/'

    return (
      <Flex
        as="header"
        flexDirection={['column', 'row']}
        flexWrap="nowrap"
        alignItems="center"
      >
        <Box width={[1, 1 / 2, 2 / 3]}>
          <Logo />
        </Box>
        <Box style={{ display: 'flex' }} width={[1, 1 / 2, 1 / 3]}>
          <Menu
            flexDirection={['column', 'row']}
            hidden={this.state.menuHidden}
          >
            <Box pt="0.2rem" pb="0.2rem" width={1}>
              <MenuLink active={postsActive} to="/posts/">
                Posts
              </MenuLink>
            </Box>
            <Box pt="0.2rem" pb="0.4rem" width={1}>
              <MenuLink active={aboutActive} to="/about/">
                About
              </MenuLink>
            </Box>
          </Menu>
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

Header.propTypes = {
  location: PropTypes.object.isRequired,
}

export default Header
