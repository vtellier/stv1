import React from "react"
import { graphql, Link } from "gatsby"
import rehypeReact from "rehype-react"
import Layout from '../components/layout'
import { Paper } from '@material-ui/core'

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components: {
      a: Link,
  }
}).Compiler

const styles = {
    steakBody: {
        margin: `20px auto 0 auto`,
        maxWidth: 960,
        padding: `0px 1.0875rem 1.45rem`,
        paddingTop: 0,
    }
};

export default ({ data, pageContext }) => {
    const page = data.markdownRemark;

    return (
        <Layout pageContext={pageContext}>
            <h1>{ page.frontmatter.title }</h1>
            <Paper style={styles.steakBody} >
                { renderAst( page.htmlAst ) }
            </Paper>
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

