import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  html {
    font-size: 20px;
    height: 100%;
  }

  body {
    color: #3c3c3c;
    margin: 0;
    font-family: Amiri;
    height: 100%;
  }

  a {
    touch-action: manipulation;
  }

  p,ul {
    code {
      background-color: #f7f7f9;
      border-radius: .25rem;
      color: #bd4147;
      font-size: 0.90rem;
      padding: .2rem .4rem;
    }
  }

  code[class*="language-"] {
    font-size: 0.75rem;
  }

  article {
    .subtitle {
      color: #3c3c3c;
      display: block;
      font-family: Poppins;
      font-size: 0.90rem;
      font-weight: 500;
    }

    .table-responsive {
      width: 100%;
    }
  }

  table {
    border-collapse: collapse;
    font-family: Poppins;
    font-size: 0.85rem;
    width: 100%;

    th, tr, td {
      border: 1px solid #ccc;
      padding: 0.4rem 0.5rem;
    }

    th {
      background-color: #e1e1e1;
      text-align: left;
    }
  }

  .gatsby-highlight {
    font-size: 0.80rem;
  }
`

export default GlobalStyle
