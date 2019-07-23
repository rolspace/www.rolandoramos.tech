import PropTypes from 'prop-types'
import React from 'react'
import PostArticle from './styled/post-article'
import PostDate from './styled/post-date'
import PostImageCaption from './styled/post-image-caption'
import PostTitle from './styled/post-title'

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
      <p
        dangerouslySetInnerHTML={{
          __html: node.excerpt,
        }}
      />
    </PostArticle>
  )
}

Excerpt.propTypes = {
  node: PropTypes.object.isRequired,
}

export default Excerpt
