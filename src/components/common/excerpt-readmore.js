import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import { FaChevronRight } from 'react-icons/fa'
import styled from 'styled-components'

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
