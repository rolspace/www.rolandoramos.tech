import PropTypes from 'prop-types'
import React from 'react'
import ReadMore from './common/read-more'
import PostArticle from './common/post-article'
import PostDate from './common/post-date'
import PostCaption from './common/post-caption'
import PostTitle from './common/post-title'

const Excerpt = (props) => {
  const { node } = props
  const title = node.frontmatter.title || node.fields.slug
  const { image, caption, captionLink, captionHref } = node.frontmatter

  return (
    <PostArticle>
      <PostDate date={node.frontmatter.date} />
      {image ? (
        <PostCaption
          caption={caption}
          captionLink={captionLink}
          captionHref={captionHref}
          image={image}
        />
      ) : (
        ''
      )}
      <PostTitle to={node.fields.slug} title={title} />
      <div
        dangerouslySetInnerHTML={{
          __html: node.excerpt,
        }}
      />
      {node.frontmatter.excerpt ? (
        <ReadMore to={node.fields.slug}>Read More</ReadMore>
      ) : (
        ''
      )}
    </PostArticle>
  )
}

Excerpt.propTypes = {
  node: PropTypes.object.isRequired,
}

export default Excerpt
