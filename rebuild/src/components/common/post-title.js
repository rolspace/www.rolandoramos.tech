import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import styled from 'styled-components'

const TitleLink = styled(Link)`
  color: #5a5a5a;
  font-family: Poppins;
  font-size: 1.3rem;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    color: #e84145;
  }`

const PostTitle = (props) => {
  const { title, to } = props

  return (
    <h2 style={{ lineHeight: `1`, margin: `0 0 1.0rem 0` }}>
      <TitleLink to={to}>{title}</TitleLink>
    </h2>
  )
}

PostTitle.propTypes = {
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
}

export default PostTitle
