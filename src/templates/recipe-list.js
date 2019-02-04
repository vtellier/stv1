import React from "react"
import { Link } from "gatsby"
import rehypeReact from "rehype-react"
import CardRecipe from '../components/CardRecipe.js'

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components: {
      a: Link,
  }
}).Compiler

export default ({ data, pageContext }) => {
    const recipe   = data.markdownRemark;

    let images = data.images.edges.map(i => i.node);
    images = images.reduce((acc,curr) => {
        const path = curr.relativePath;
        const endName = '-cover' + curr.ext;
        const id = '/' + path.substring(0, path.length - endName.length);
        acc[id] = curr;
        return acc;
    }, {});

    let recipes = data.recipes.edges.reduce((acc,curr) => {
        if(curr.node.context.locale === pageContext.locale) {
            curr.image = images[curr.node.context.slug];
            if(curr.image)
                acc.push(curr);
        }
        return acc;
    },[]);

    console.log(recipes);

    return (
        <>
            { renderAst( recipe.htmlAst ) }
            { recipes.map(r => (
                <CardRecipe
                    key={'rli-'+r.node.path}
                    link={r.node.path}
                    image={r.image.publicURL}
                >
                </CardRecipe>
            )) }
        </>
    );
}

export const query = graphql`
    query($pathDotLanguage: String!) {
        recipes: allSitePage (
            filter: {
                context: {
                    canonical: {
                        eq: null
                    }
                }
                path: {
                    regex: "/recipes/"
                }
            }
        ) {
            edges {
                node {
                    id
                    path
                    context {
                        slug
                        locale
                        canonical
                        pathRegex
                        pathDotLanguage
                    } 
                }
            }
        }
        images: allFile (
            filter: {
                absolutePath: { regex: "/images/recipes/" }
            }
        ) {
            edges {
                node {
                    publicURL
                    relativePath
                    ext
                    childImageSharp {
                        fluid(maxWidth: 200) {
                            ...GatsbyImageSharpFluid
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

