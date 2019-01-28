import React from 'react'
import { Link, graphql } from 'gatsby'

import Layout from '../components/layout'
import Image from '../components/image'
import SEO from '../components/seo'

const IndexPage = ({ data, pageContext }) => {
    return (
        <Layout context={pageContext}>
            <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
            <h1>Salut les gens</h1>
            <h4>{data.allMarkdownRemark.totalCount} Posts</h4>
            {data.allMarkdownRemark.edges.map(({ node }) => (
                <article key={node.id}>
                    <Link to={node.fields.link}>
                        <h3>
                            {node.frontmatter.title}{" "}
                            <span>
                                — {node.frontmatter.date}
                            </span>
                        </h3>
                        <p>{node.excerpt}</p>
                    </Link>
                </article>
            ))}
            <p>Welcome to your new Gatsby site.</p>
            <p>Now go build something great.</p>
            <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
                <Image />
            </div>
            <Link to="/page-2/">Go to page 2</Link>
            <Link to="/file-list/">Go to file list</Link>
            <Link to="/fr/content/">Go to french content</Link>
        </Layout>
    )
}

export default IndexPage
export const query = graphql`
  query {
    allMarkdownRemark {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
          fields { link }
          excerpt
        }
      }
    }
  }
`

