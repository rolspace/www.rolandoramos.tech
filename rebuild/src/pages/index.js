import { graphql } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import Layout from '../components/layout'
import Excerpt from '../components/excerpt'
import SEO from '../components/seo'

class BlogIndex extends React.Component {
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
            <Excerpt key={index} node={node}></Excerpt>
          )
        })}
      </Layout>
    )
  }
}

BlogIndex.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.string.isRequired,
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
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
