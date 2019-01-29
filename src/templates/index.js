import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

export default ({ data, pageContext }) => {
    const recipe = data.markdownRemark;

    return (
        <Layout context={pageContext}>
            <h1>{ recipe.frontmatter.title }</h1>
            <div dangerouslySetInnerHTML={{ __html: recipe.html }}/>
        </Layout>
    )
}

export const query = graphql`
    query($link: String!) {
        markdownRemark(fields: { link: { eq: $link } }) {
            html
            frontmatter {
                title
            }
        }
    }
`

