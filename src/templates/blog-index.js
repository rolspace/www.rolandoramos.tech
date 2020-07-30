/* eslint-disable space-infix-ops */
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import Excerpt from '../components/excerpt'
import Layout from '../components/layout'
import Pager from '../components/pager'
import SEO from '../components/seo'

const BlogIndex = (props) => {
  const { currentPage, pageCount } = props.pageContext
  const { data } = props
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges

  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO
        keywords={[
          'Rolando Ramos',
          'solution architect',
          'personal blog',
          'software engineering',
        ]}
      />
      {posts.map(({ node }, index) => {
        return <Excerpt key={index} node={node}></Excerpt>
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

BlogIndex.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
}

export default BlogIndex

export const pageQuery = graphql`
  query BlogIndexes($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/blog/" } }
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
                fluid {
                  ...GatsbyImageSharpFluid
                }
              }
            }
            caption
            captionLink
            captionHref
            excerpt
          }
        }
      }
    }
  }
`
