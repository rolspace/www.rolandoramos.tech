/* eslint-disable space-infix-ops */
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import PostArticle from '../components/common/post-article'
import PostDate from '../components/common/post-date'
import PostImageCaption from '../components/common/post-image-caption'
import PostTitle from '../components/common/post-title'
import Layout from '../components/layout'
import Pager from '../components/pager'
import SEO from '../components/seo'

const BlogPost = (props) => {
  const post = props.data.markdownRemark
  const siteTitle = props.data.site.siteMetadata.title
  const { previous, next, slug } = props.pageContext
  const { image, caption, captionLink, captionHref } = post.frontmatter

  let fluidImage = null
  if (image && image.childImageSharp && image.childImageSharp.fluid) {
    fluidImage = image.childImageSharp.fluid
  }

  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO title={post.frontmatter.title} />
      <PostArticle>
        <PostDate date={post.frontmatter.date} />
        {fluidImage ? (
          <PostImageCaption
            caption={caption}
            captionLink={captionLink}
            captionHref={captionHref}
            fluidImage={fluidImage}
          />
        ) : (
          ''
        )}
        <PostTitle title={post.frontmatter.title} to={slug} />
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </PostArticle>
      <Pager
        nextExists={Boolean(next)}
        nextTitle={next ? next.frontmatter.title : ''}
        nextTo={next ? next.fields.slug : ''}
        previousExists={Boolean(previous)}
        previousTitle={previous ? previous.frontmatter.title : ''}
        previousTo={previous ? previous.fields.slug : ''}
      />
    </Layout>
  )
}

BlogPost.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
}

export default BlogPost

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        image {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
        caption
        captionLink
        captionHref
      }
    }
  }
`
