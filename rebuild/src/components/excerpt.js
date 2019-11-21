import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import React from 'react'
import PostArticle from './common/post-article'
import PostDate from './common/post-date'
import PostImageCaption from './common/post-image-caption'
import PostTitle from './common/post-title'

const Excerpt = (props) => {
  const { node } = props
  const title = node.frontmatter.title || node.fields.slug
  const { image, caption, captionLink, captionHref } = node.frontmatter

  let fluidImage = null
  if (image && image.childImageSharp && image.childImageSharp.fluid) {
    fluidImage = image.childImageSharp.fluid
  }

  return (
    <PostArticle>
      <PostDate date={node.frontmatter.date} />
      { fluidImage ?
        <PostImageCaption
          caption={caption}
          captionLink={captionLink}
          captionHref={captionHref}
          fluidImage={fluidImage}
        /> :
        ''
      }
      <PostTitle to={node.fields.slug} title={title} />
      <div
        dangerouslySetInnerHTML={{
          __html: node.excerpt,
        }}
      />
      { node.frontmatter.excerpt ? <Link to={node.fields.slug}>Read More</Link> : '' }
    </PostArticle>
  )
}

Excerpt.propTypes = {
  node: PropTypes.object.isRequired,
}

export default Excerpt
