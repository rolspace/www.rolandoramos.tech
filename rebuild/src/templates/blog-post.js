/* eslint-disable space-infix-ops */
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import Layout from '../components/layout'
import Pager from '../components/pager'
import SEO from '../components/seo'
import PostArticle from '../components/styled/post-article'
import PostDate from '../components/styled/post-date'
import PostImageCaption from '../components/styled/post-image-caption'
import PostTitle from '../components/styled/post-title'

class BlogPostTemplate extends React.Component {
  render () {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next, slug } = this.props.pageContext
    const { image, caption, captionLink, captionHref } = post.frontmatter

    let fluidImage = null
    if (image && image.childImageSharp && image.childImageSharp.fluid) {
      fluidImage = image.childImageSharp.fluid
    }

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title={post.frontmatter.title} />
        <PostArticle>
          <PostDate date={post.frontmatter.date} />
          { fluidImage ?
            <PostImageCaption
              caption={caption}
              captionLink={captionLink}
              captionHref={captionHref}
              fluidImage={fluidImage}
            /> :
            ''
          }
          <PostTitle title={post.frontmatter.title} to={slug} />
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </PostArticle>
        <Pager
          nextExists={Boolean(next)}
          nextTitle={next.frontmatter.title}
          nextTo={next.fields.slug}
          previousExists={Boolean(previous)}
          previousTitle={previous.frontmatter.title}
          previousTo={previous.fields.slug}
        />
      </Layout>
    )
  }
}

BlogPostTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.string.isRequired,
  pageContext: PropTypes.object.isRequired,
}

export default BlogPostTemplate

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
            fluid { ...GatsbyImageSharpFluid }
          }
        }
        caption
        captionLink
        captionHref
      }
    }
  }
`
