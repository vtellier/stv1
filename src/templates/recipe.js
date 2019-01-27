import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

export default ({ data, pageContext }) => {
    const recipe = data.markdownRemark;
    console.log(data.allMarkdownRemark);
    return (
        <Layout>
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
        },
        allMarkdownRemark { edges { node { fields { link, slug, locale } }}},
    }
`

