import { Link } from 'gatsby'
import styled from 'styled-components'

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

export default MenuLink
