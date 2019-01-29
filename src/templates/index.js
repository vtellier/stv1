import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

export default ({ data, pageContext }) => {
    const page = data.markdownRemark;
    console.log(page);

    return (
        <Layout context={pageContext}>
            <h1>{ page.frontmatter.title }</h1>
            <div dangerouslySetInnerHTML={{ __html: page.html }}/>
        </Layout>
    )
}

export const query = graphql`
    query($slug: String!) {
        markdownRemark(fields: { slug: { eq: $slug } }) {
            html
            frontmatter {
                title
            }
        }
    }
`

