import { Flex } from '@rebass/grid'
import styled from 'styled-components'

const Menu = styled(Flex)`
  display: ${props => (props.hidden ? 'none' : 'flex')};

  @media (min-width: 40em) {
    display: flex;
    margin-left: auto !important;
  }
`

export default Menu
