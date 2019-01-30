import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

export default ({ data, pageContext }) => {
    const page = data.markdownRemark;

    return (
        <Layout context={pageContext}>
            <h1>{ page.frontmatter.title }</h1>
            <div dangerouslySetInnerHTML={{ __html: page.html }}/>
        </Layout>
    )
}

export const query = graphql`
    query($pathDotLanguage: String!) {
        markdownRemark(fields: { pathDotLanguage: { eq: $pathDotLanguage } }) {
            html
            frontmatter {
                title
            }
        }
    }
`

