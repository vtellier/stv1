import React from "react"
import { graphql } from "gatsby"
import Img from 'gatsby-image'
import Layout from "../components/layout"

export default ({ data, pageContext }) => {
    const recipe = data.markdownRemark;

    const { slug } = pageContext;

    console.log(pageContext.filesRegex);
    console.log(data.allFile);
    const images = data.allFile.edges.reduce((acc,curr) => {
        const { ext, relativePath } = curr.node;
        const id = relativePath.substring( slug.length+1, relativePath.length-ext.length );
        acc[id] = curr.node;
        return acc;
    }, {});

    console.log(images);

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
    query($slug: String!, $filesRegex: String!) {
        allFile (
            filter: {
                relativePath: { regex: $filesRegex }
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
        markdownRemark(fields: { slug: { eq: $slug } }) {
            html
            frontmatter {
                title
            }
        }
    }
`

