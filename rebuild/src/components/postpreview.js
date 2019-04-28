import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"

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

  return (
    <Post>
      <PostDate>{node.frontmatter.date}</PostDate>
      <h2 style={{ lineHeight: `1`, margin: `0 0 1rem 0` }}>
        <PostTitleLink>{title}</PostTitleLink>
      </h2>
      <p
        dangerouslySetInnerHTML={{
          __html: node.frontmatter.description || node.excerpt,
        }}
      />
    </Post>
  )
}

export default PostPreview