/* eslint-disable space-infix-ops */
import { Box, Flex } from '@rebass/grid'
import PropTypes from 'prop-types'
import React from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import StyledLink from './lib/styled-link'

const Pager = (props) => {
  return (
    <Flex style={{ marginBottom: '1.5rem' }}>
      <Box width={[1 / 2]} style={{ lineHeight: 1 }}>
        {props.previousExists && (
          <StyledLink to={props.previousTo} rel="previous">
            <FaChevronLeft />
            &nbsp;{props.previousTitle || 'Previous'}
          </StyledLink>
        )}
      </Box>
      <Box width={[1 / 2]} style={{ lineHeight: 1, textAlign: 'right' }}>
        {props.nextExists && (
          <StyledLink to={props.nextTo} rel="next">
            {props.nextTitle || 'Next'}&nbsp;
            <FaChevronRight />
          </StyledLink>
        )}
      </Box>
    </Flex>
  )
}

Pager.propTypes = {
  nextExists: PropTypes.bool.isRequired,
  nextTitle: PropTypes.string,
  nextTo: PropTypes.string.isRequired,
  previousExists: PropTypes.bool.isRequired,
  previousTitle: PropTypes.string,
  previousTo: PropTypes.string.isRequired,
}

export default Pager
