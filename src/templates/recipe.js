import React from "react"
import { graphql } from "gatsby"
import Img from 'gatsby-image'
import Layout from "../components/layout"

export default ({ data, pageContext }) => {
    const recipe   = data.markdownRemark;

    const { pathRegex } = pageContext;

    const images = data.allFile.edges.reduce((acc,curr) => {
        const { ext, relativePath } = curr.node;
        const id = relativePath.substring( pathRegex.length-1, relativePath.length-ext.length );
        acc[id] = curr.node;
        return acc;
    }, {});

    return (
        <Layout context={pageContext}>
            <header>
                <h1>{ recipe.frontmatter.title }</h1>
                { images['cover'] &&
                    <Img fixed={images['cover'].childImageSharp.fixed} />
                }
            </header>
            <div dangerouslySetInnerHTML={{ __html: recipe.html }}/>
        </Layout>
    )
}

export const query = graphql`
    query($pathDotLanguage: String!, $pathRegex: String!) {
        allFile (
            filter: {
                relativePath: { regex: $pathRegex }
                absolutePath: { regex: "/images/" }
            }
        ) {
            edges {
                node {
                    relativePath
                    ext
                    childImageSharp {
                        fixed(width: 380, height: 285) {
                            ...GatsbyImageSharpFixed
                        }
                    }
                }
            }
        }

        markdownRemark(fields: { pathDotLanguage: { eq: $pathDotLanguage } }) {
            html
            frontmatter {
                title
            }
        }
    }
`

