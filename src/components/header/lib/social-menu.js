/* eslint-disable space-infix-ops */
import { Box, Flex } from '@rebass/grid'
import React from 'react'
import { FaGithub, FaLinkedinIn, FaStackOverflow } from 'react-icons/fa'
import styled from 'styled-components'
import SocialLink from '../../common/social-link'

const StyledBox = styled(Box)`
  display: block;

  @media (min-width: 56em) {
    display: none;
  }
`

const SocialMenu = (props) => {
  return (
    <StyledBox width={1}>
      <Flex flexDirection="row" flexWrap="nowrap">
        <Box width={1 / 3} pl="2em" pr="2em">
          <SocialLink>
            <FaLinkedinIn />
          </SocialLink>
        </Box>
        <Box width={1 / 3} pl="2em" pr="2em">
          <SocialLink>
            <FaGithub />
          </SocialLink>
        </Box>
        <Box width={1 / 3} pl="2em" pr="2em">
          <SocialLink>
            <FaStackOverflow />
          </SocialLink>
        </Box>
      </Flex>
    </StyledBox>
  )
}

export default SocialMenu
