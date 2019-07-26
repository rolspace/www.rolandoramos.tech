/* eslint-disable space-infix-ops */
import { Box, Flex } from '@rebass/grid'
import PropTypes from 'prop-types'
import React from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import styled from 'styled-components'
import PageLink from './styled/page-link'

const PagerFlex = styled(Flex)`
  margin-bottom: 1.5rem;`

const Pager = (props) => {
  return (
    <PagerFlex>
      <Box width={[1/2]} style={{ lineHeight: 1 }}>
        {props.previousExists && (
          <PageLink to={props.previousTo} rel='previous'>
            <FaChevronLeft />&nbsp;{props.previousTitle || 'Previous'}
          </PageLink>
        )}
      </Box>
      <Box width={[1/2]} style={{ lineHeight: 1, textAlign: 'right' }}>
        {props.nextExists && (
          <PageLink to={props.nextTo} rel='next'>
            {props.nextTitle || 'Next'}&nbsp;<FaChevronRight />
          </PageLink>
        )}
      </Box>
    </PagerFlex>
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
