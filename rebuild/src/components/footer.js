/* eslint-disable space-infix-ops */
import React from 'react'
import { Box, Flex } from '@rebass/grid'
import styled from 'styled-components'

const CustomFooter = styled.footer`
  border-top: 1px solid #e84145;
  color: #979797;
  font-family: Poppins;
  font-size: 0.7em;
  height: 2.5rem;
  line-height: 2.5rem;
  padding: 0 1.5rem;
  text-align: center;

  @media (min-width: 52em) {
    text-align: left;
  }`

const FootnoteBox = styled(Box)`
  font-size: 0.65rem;
  line-height: 1rem;
  text-align: center;
  margin-bottom: 0.25rem;
  margin-top: 0.25rem;

  @media (min-width: 52em) {
    text-align: right;
  }`

const Footer = (props) => {
  return (
    <CustomFooter>
      <Flex flexDirection={['column', 'column', 'row']}>
        <Box width={[1, 1, 1/4]}>
          <span>© 2014-{new Date().getFullYear()} Rolando Ramos</span>
        </Box>
        <FootnoteBox width={[1, 1, 3/4]}>
          <div>
            This work is licensed under a <a href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License.</a>
          </div>
          <div>
            The opinions expressed in this website are my own, not my employer&apos;s.
          </div>
        </FootnoteBox>
      </Flex>
    </CustomFooter>
  )
}

export default Footer
