import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const InnerMenuLink = ({ active, className, ...props }) => (
  <Link to={props.to} className={className}>
    {props.children}
  </Link>
)

InnerMenuLink.propTypes = {
  active: PropTypes.bool.isRequired,
  className: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
}

const MenuLink = styled(InnerMenuLink)`
  color: ${props => (props.active ? `#000` : `#adadad`)};
  font-family: Poppins;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.03rem;
  text-transform: uppercase;
  text-decoration: none;

  @media (min-width: 40em) {
    padding: 0rem 0.5rem;
  }
`

export default MenuLink
