const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const firstPromise = graphql(
    `
      {
        allMarkdownRemark(
          filter: { fileAbsolutePath: { regex: "/blog/" }}
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fileAbsolutePath
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

    // Create blog index pages
    const postsPerPage = 5
    const pageCount = Math.ceil(posts.length / postsPerPage)
    const blogIndexTemplate = path.resolve('./src/templates/blog-index.js')

    Array.from({ length: pageCount }).forEach((_, i) => {
      createPage({
        path: i === 0 ? '/' : `/page/${i + 1}`,
        component: blogIndexTemplate,
        context: {
          limit: postsPerPage,
          skip: i * postsPerPage,
          pageCount,
          currentPage: i + 1,
        },
      })
    })

    // Create blog titles page
    const blogTitlesTemplate = path.resolve('./src/templates/blog-titles.js')

    createPage({
      path: '/posts',
      component: blogTitlesTemplate,
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

  const secondPromise = graphql(
    `
      {
        allMarkdownRemark(
          filter: { fileAbsolutePath: { regex: "/about/" }}
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fileAbsolutePath
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

    const blogAboutTemplate = path.resolve('./src/templates/blog-about.js')

    createPage({
      path: '/about',
      component: blogAboutTemplate,
    })

    return null
  })

  await Promise.all([firstPromise, secondPromise])
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
