/* eslint-disable space-infix-ops */
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import PostArticle from '../components/common/post-article'
import PostDate from '../components/common/post-date'
import PostTitle from '../components/common/post-title'
import Layout from '../components/layout'
import SEO from '../components/seo'

class BlogTitles extends React.Component {
  render () {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title='All posts'
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        {posts.map(({ node }, index) => {
          return (
            <PostArticle key={index} paddingBottom='0'>
              <PostDate date={node.frontmatter.date} />
              <PostTitle title={node.frontmatter.title} to={node.fields.slug} />
            </PostArticle>
          )
        })}
      </Layout>
    )
  }
}

BlogTitles.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
}

export default BlogTitles

export const pageQuery = graphql`
  query BlogTitles {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/blog/" }}
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
          }
        }
      }
    }
  }
`
