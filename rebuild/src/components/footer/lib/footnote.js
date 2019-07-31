import { Box } from '@rebass/grid'
import styled from 'styled-components'

const Footnote = styled(Box)`
  font-size: 0.65rem;
  line-height: 1rem;
  text-align: center;
  margin-bottom: 0.25rem;
  margin-top: 0.25rem;

  @media (min-width: 52em) {
    margin-bottom: 0;
    margin-top: 0;
    text-align: right;
  }`

export default Footnote
