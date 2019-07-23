import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const DateDiv = styled.div`
  color: #adadad;
  font-family: Poppins;
  font-size: 0.7em;
  font-weight: 500;
  margin-bottom: 1.5rem;`

const PostDate = (props) => {
  return (
    <DateDiv>{props.date}</DateDiv>
  )
}

PostDate.propTypes = {
  date: PropTypes.string.isRequired,
}

export default PostDate
