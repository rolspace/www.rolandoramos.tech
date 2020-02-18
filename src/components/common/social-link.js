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

const SocialLink = (props) => {
  const { href } = props
  return (
    <StyledAnchor href={href} rel='noopener' target='_blank'>
      {props.children}
    </StyledAnchor>
  )
}

SocialLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
}

export default SocialLink
