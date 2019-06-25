/* eslint-disable space-infix-ops */
import { Box, Flex } from '@rebass/grid'
import { graphql, Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import Excerpt from '../components/excerpt'
import Layout from '../components/layout'
import SEO from '../components/seo'

class BlogList extends React.Component {
  render () {
    const { currentPage, pageCount } = this.props.pageContext
    const isFirst = currentPage === 1
    const isLast = currentPage === pageCount
    const previous = currentPage - 1 === 1 ? '/' : `page/${currentPage - 1}`
    const next = `page/${currentPage + 1}`

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
        <Flex flexDirection={['column', 'row']}>
          <Box width={[1, 1/2]}>
            {!isFirst && (
              <Link to={previous} rel='previous'>Previous</Link>
            )}
          </Box>
          <Box width={[1, 1/2]} style={{ textAlign: 'right' }}>
            {!isLast && (
              <Link to={next} rel='next'>Next</Link>
            )}
          </Box>
        </Flex>
      </Layout>
    )
  }
}

BlogList.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
}

export default BlogList

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
