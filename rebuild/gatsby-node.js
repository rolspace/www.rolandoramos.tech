const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    const posts = result.data.allMarkdownRemark.edges

    // Create blog pages
    const postsPerPage = 5
    const pageCount = Math.ceil(posts.length / postsPerPage)
    const blogPageTemplate = path.resolve('./src/templates/blog-page.js')

    Array.from({ length: pageCount }).forEach((_, i) => {
      createPage({
        path: i === 0 ? '/' : `/page/${i + 1}`,
        component: blogPageTemplate,
        context: {
          limit: postsPerPage,
          skip: i * postsPerPage,
          pageCount,
          currentPage: i + 1,
        },
      })
    })

    // Create blog titles list page
    const blogTitlesListTemplate = path.resolve('./src/templates/blog-titles-list.js')

    createPage({
      path: '/posts',
      component: blogTitlesListTemplate,
    })

    // Create blog posts pages.
    const blogPostTemplate = path.resolve('./src/templates/blog-post.js')

    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      createPage({
        path: post.node.fields.slug,
        component: blogPostTemplate,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      })
    })

    return null
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === 'MarkdownRemark') {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
