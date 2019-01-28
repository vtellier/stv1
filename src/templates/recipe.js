import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"

function Languages(props) {
    return (
        <div
            id="translation-menu">
            { props.translations.map(tr =>  (
                    <Link key={tr.link} to={ tr.link }>
                        { tr.locale }
                    </Link>
                )
            ) }
        </div>
    )
}

export default ({ data, pageContext }) => {
    const recipe = data.markdownRemark;
    const translations = data.allMarkdownRemark && data.allMarkdownRemark.edges.map(obj => obj.node.fields);
    //console.log(translations);

    return (
        <Layout context={pageContext}>
            <h1>{ recipe.frontmatter.title }</h1>
            <div dangerouslySetInnerHTML={{ __html: recipe.html }}/>
            <Languages translations={translations} />
        </Layout>
    )
}

export const query = graphql`
    query($link: String!, $slug: String!, $locale: String!) {
        markdownRemark(fields: { link: { eq: $link } }) {
            html
            frontmatter {
                title
            }
        },
        allMarkdownRemark
            ( filter: { fields: { locale: { ne: $locale }, slug: { eq: $slug } } } )
            { edges { node { fields { link, slug, locale } }}},
    }
`

