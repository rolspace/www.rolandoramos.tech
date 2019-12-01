import { graphql } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import PostArticle from '../components/common/post-article'
import Layout from '../components/layout'
import SEO from '../components/seo'
import PostTitle from '../components/common/post-title'

class BlogAbout extends React.Component {
  render () {
    const { data } = this.props
    const post = data.markdownRemark
    const siteTitle = data.site.siteMetadata.title

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title='About'
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        <PostArticle>
          <PostTitle title={post.frontmatter.title} to="/about/"></PostTitle>
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </PostArticle>
      </Layout>
    )
  }
}

BlogAbout.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
}

export default BlogAbout

export const pageQuery = graphql`
  query BlogAbout {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fileAbsolutePath: { regex: "/\/about\//" }) {
      html
      frontmatter {
        title
      }
    }
  }
`
