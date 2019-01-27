import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

export default ({ data }) => {
    const recipe = data.markdownRemark;
    return (
        <Layout>
            <h1>{ recipe.frontmatter.title }</h1>
            <div dangerouslySetInnerHTML={{ __html: recipe.html }}/>
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

