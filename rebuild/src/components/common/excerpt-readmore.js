import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import styled from 'styled-components'
import { FaChevronRight } from 'react-icons/fa'

const ReadMoreLink = styled(Link)`
  color: #adadad;
  font-family: Poppins;
  font-weight: 500;
  font-size: 0.7rem;
  text-decoration: none;

  &:hover {
    color: #5a5a5a;
  }

  & svg {
    vertical-align: middle;
  }
`

const ReadMore = (props) => {
  return (
    <ReadMoreLink to={props.to}>{props.children}&nbsp;<FaChevronRight /></ReadMoreLink>
  )
}

ReadMore.propTypes = {
  children: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
}

export default ReadMore
