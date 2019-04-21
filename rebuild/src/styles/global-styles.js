import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  html {
    font-size: 20px;
  }

  body {
    color: #3c3c3c;
    margin: 0;
    font-family: Amiri;
  }

  a {
    touch-action: manipulation;
  }
`

export default GlobalStyle