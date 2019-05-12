import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import Img from "gatsby-image"

const Post = styled.article`
  padding-bottom: 2rem;`

const PostDate = styled.div`
  color: #adadad;  
  font-family: Poppins;
  font-size: 0.7rem;
  font-weight: 500;
  margin-bottom: 1.5rem;`

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
  const { image } = node.frontmatter
  const { imageCaption } = node.frontmatter

  let fluidImage = null;
  if (image && image.childImageSharp && image.childImageSharp.fluid)
  {
    fluidImage = image.childImageSharp.fluid
  }

  return (
    <Post>
      <PostDate>{node.frontmatter.date}</PostDate>
      { fluidImage ? 
        <div style={{ marginBottom: `1.5rem` }}>
          <Img fluid={fluidImage}></Img>
          <div>{imageCaption}</div>
        </div>
        :
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

export default PostPreview