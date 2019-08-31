/* eslint-disable space-infix-ops */
import React from 'react'
import { Box, Flex } from '@rebass/grid'
import Footnote from './lib/footnote'
import FooterContainer from './lib/footer-container'

const Footer = (props) => {
  return (
    <FooterContainer>
      <Flex flexDirection={['column', 'column', 'row']}>
        <Box width={[1, 1, 1/4]}>
          <span>© 2014-{new Date().getFullYear()} Rolando Ramos</span>
        </Box>
        <Footnote width={[1, 1, 3/4]}>
          <div>
            This work is licensed under a <a href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License.</a>
          </div>
          <div>
            The opinions expressed in this website are my own, not my employer&apos;s.
          </div>
        </Footnote>
      </Flex>
    </FooterContainer>
  )
}

export default Footer
