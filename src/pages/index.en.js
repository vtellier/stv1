import React from 'react'
import { Link, graphql } from 'gatsby'

import Layout from '../components/layout'
import Image from '../components/image'
import SEO from '../components/seo'

const IndexPage = ({ data, pageContext }) => {
    console.log(data, pageContext);
    const { allMarkdownRemark } = data;
    return (
        <Layout context={pageContext}>
            <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
            <h1>Hi people</h1>
            <h4>{allMarkdownRemark.totalCount} Posts</h4>
            {allMarkdownRemark.edges.map(({ node }) => (
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
        </Layout>
    )
}

export default IndexPage
export const query = graphql`
  query {
    allMarkdownRemark {
      totalCount
      edges  {
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

