import React from "react"
import { graphql, Link } from "gatsby"
import rehypeReact from "rehype-react"
import Layout from '../components/layout'

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components: {
      a: Link,
  }
}).Compiler

export default ({ data, pageContext }) => {
    const page = data.markdownRemark;

    return (
        <Layout pageContext={pageContext}>
            <h1>{ page.frontmatter.title }</h1>
            { renderAst( page.htmlAst ) }
        </Layout>
    )
}

export const query = graphql`
    query($pathDotLanguage: String!) {
        markdownRemark(fields: { pathDotLanguage: { eq: $pathDotLanguage } }) {
            htmlAst
            frontmatter {
                title
            }
        }
    }
`

