import React from "react"
import { graphql, Link } from "gatsby"
import Img from 'gatsby-image'
import rehypeReact from "rehype-react"
import Layout from '../components/layout'

const createElement = (component, props, children) => {
    if(component === 'a') {
        component = Link;
        if(props && props.href) {
            props.to = props.href;
            delete props.href;
        }
    }
    return React.createElement(component, props, children);
};

const renderAst = new rehypeReact({
  createElement,
}).Compiler

export default ({ data, pageContext }) => {
    const recipe   = data.markdownRemark;

    const { pathRegex } = pageContext;

    let images = {};
    if(data.allFile) {
        images = data.allFile.edges.reduce((acc,curr) => {
            const { ext, relativePath } = curr.node;
            const id = relativePath.substring( pathRegex.length-1, relativePath.length-ext.length );
            acc[id] = curr.node;
            return acc;
        }, {});
    }
    else {
        console.warn(`The recipe ${pageContext.pathDotLanguage} has no picture!`);
    }

    return (
        <Layout pageContext={pageContext}>
            <div>
                <h1>{ recipe.frontmatter.title }</h1>
                { images['cover'] &&
                    <Img fixed={images['cover'].childImageSharp.fixed} />
                }
            </div>
            { renderAst( recipe.htmlAst ) }
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
            htmlAst
            frontmatter {
                title
            }
        }
    }
`

