import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const StyledAnchor = styled.a`
  display: block;

  & svg {
    fill: #adadad;
  }

  &:hover svg {
    fill: #5a5a5a;
  }`

const SocialLink = (props) => (
  <StyledAnchor href='https://www.linkedin.com/in/rolandoramosrestrepo/' rel='noopener' target='_blank'>
    {props.children}
  </StyledAnchor>
)

SocialLink.propTypes = {
  children: PropTypes.node.isRequired,
}

export default SocialLink
