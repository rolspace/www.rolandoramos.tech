/* eslint-disable space-infix-ops */
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import Excerpt from '../components/excerpt'
import Layout from '../components/layout'
import Pager from '../components/pager'
import SEO from '../components/seo'

class BlogPage extends React.Component {
  render () {
    const { currentPage, pageCount } = this.props.pageContext
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
            <Excerpt key={index} node={node}></Excerpt>
          )
        })}
        <Pager
          nextExists={!(currentPage === pageCount)}
          nextTo={`/page/${currentPage + 1}`}
          previousExists={!(currentPage === 1)}
          previousTo={currentPage - 1 === 1 ? '/' : `/page/${currentPage - 1}`}
        />
      </Layout>
    )
  }
}

BlogPage.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
}

export default BlogPage

export const pageQuery = graphql`
  query BlogPagesPaginated($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        limit: $limit
        skip: $skip
      ) {
      edges {
        node {
          excerpt(format: HTML)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
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
    }
  }
`
