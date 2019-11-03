/* eslint-disable space-infix-ops */
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import PostArticle from '../components/common/post-article'
import PostDate from '../components/common/post-date'
import PostTitle from '../components/common/post-title'
import Layout from '../components/layout'
import SEO from '../components/seo'

class BlogTitlesList extends React.Component {
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

BlogTitlesList.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
}

export default BlogTitlesList

export const pageQuery = graphql`
  query BlogTitlesListPage {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
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
