import { Link } from 'gatsby'
import React from 'react'
import styled from 'styled-components'
import logo from '../../../../content/assets/logo.png'

const LogoHeader = styled.h1`
  line-height: 1;
  margin: 0;
`

const LogoLink = styled(Link)`
  display: inline-block;

  @media (min-width: 40em) {
    padding-bottom: 0.25rem;
    padding-top: 0.25rem;
  }
`

const Logo = props => {
  return (
    <LogoHeader>
      <LogoLink to='/'>
        <img
          style={{ marginLeft: '-0.5rem', verticalAlign: 'middle' }}
          src={logo}
          width={225}
          alt='www.rolandoramos.tech'
        />
      </LogoLink>
    </LogoHeader>
  )
}

export default Logo
