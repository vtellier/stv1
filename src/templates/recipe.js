import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

export default ({ data }) => {
    console.log(data);
    let html = data.markdownRemark.html;
    let meta = data.markdownRemark.frontmatter;
    return (
        <Layout>
            <h1>{ meta.title }</h1>
            <div dangerouslySetInnerHTML={{__html: html }} />
        </Layout>
    )
}

export const query = graphql`
    query($path: String!, $langKey: String!) {
        markdownRemark(fields: { slug: { eq: $path } }) {
            html
            excerpt
            fields {
                slug
                langKey
            }
            frontmatter {
                title
            }
        }
        allMarkdownRemark
            ( filter: { fields: { langKey: { ne: $langKey }, slug: { eq: $path } } } )
            { edges { node { fields { slug, langKey } }}}
    }
`

