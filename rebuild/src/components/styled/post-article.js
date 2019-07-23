import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const Article = styled.article`
  border-bottom: 1px solid #adadad;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;`

const PostArticle = (props) => {
  return (
    <Article>{props.children}</Article>
  )
}

PostArticle.propTypes = {
  children: PropTypes.children,
}

export default PostArticle
