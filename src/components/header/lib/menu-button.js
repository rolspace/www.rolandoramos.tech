import styled from 'styled-components'

const MenuButton = styled.button`
  background: 0 0;
  border: none;
  margin: 0;
  outline: 0;
  padding: 0;
  position: absolute;
  right: 6px;
  touch-action: manipulation;

  @media (min-width: 52em) {
    display: none;
  }
`

export default MenuButton
