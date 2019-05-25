import { Link } from 'gatsby'
import Img from 'gatsby-image'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const Post = styled.article`
  padding-bottom: 2rem;`

const PostDate = styled.div`
  color: #adadad;
  font-family: Poppins;
  font-size: 0.7em;
  font-weight: 500;
  margin-bottom: 1.5rem;`

const ImageCaption = styled.div`
  color: #636c72;
  font-family: Poppins;
  font-size: 0.650em;
  text-align: right;`

const PostTitleLink = styled(Link)`
  color: #5a5a5a;
  font-family: Poppins;
  font-size: 1.3rem;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    color: #e84145;
  }`

const PostPreview = (props) => {
  const { node } = props
  const title = node.frontmatter.title || node.fields.slug
  const { image, caption, captionLink, captionHref } = node.frontmatter

  let fluidImage = null
  if (image && image.childImageSharp && image.childImageSharp.fluid) {
    fluidImage = image.childImageSharp.fluid
  }

  return (
    <Post>
      <PostDate>{node.frontmatter.date}</PostDate>
      { fluidImage ?
        <div style={{ marginBottom: `1.5rem` }}>
          <Img style={{ marginBottom: `0.250rem` }} fluid={fluidImage}></Img>
          <ImageCaption>
            {caption}&nbsp;
            <Link css={{ color: `#0275d8` }} to={captionHref}>{captionLink}</Link>
          </ImageCaption>
        </div> :
        ''
      }
      <h2 style={{ lineHeight: `1`, margin: `0 0 1.5rem 0` }}>
        <PostTitleLink to={node.fields.slug}>{title}</PostTitleLink>
      </h2>
      <p
        dangerouslySetInnerHTML={{
          __html: node.excerpt,
        }}
      />
    </Post>
  )
}

PostPreview.propTypes = {
  node: PropTypes.node.isRequired,
}

export default PostPreview
