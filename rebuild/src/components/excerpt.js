import { Link } from 'gatsby'
import Img from 'gatsby-image'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const ExcerptPost = styled.article`
  border-bottom: 1px solid #adadad;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;`

const ExcerptDate = styled.div`
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

const ExcerptTitleLink = styled(Link)`
  color: #5a5a5a;
  font-family: Poppins;
  font-size: 1.3rem;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    color: #e84145;
  }`

const Excerpt = (props) => {
  const { node } = props
  const title = node.frontmatter.title || node.fields.slug
  const { image, caption, captionLink, captionHref } = node.frontmatter

  let fluidImage = null
  if (image && image.childImageSharp && image.childImageSharp.fluid) {
    fluidImage = image.childImageSharp.fluid
  }

  return (
    <ExcerptPost>
      <ExcerptDate>{node.frontmatter.date}</ExcerptDate>
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
        <ExcerptTitleLink to={node.fields.slug}>{title}</ExcerptTitleLink>
      </h2>
      <p
        dangerouslySetInnerHTML={{
          __html: node.excerpt,
        }}
      />
    </ExcerptPost>
  )
}

Excerpt.propTypes = {
  node: PropTypes.node.isRequired,
}

export default Excerpt
