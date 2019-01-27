/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require('path')
const { createFilePath } = require(`gatsby-source-filesystem`)

const addNodeFields = ({ fileNode, createNodeField, node }) => {
    const regex    = /pages\/(.*)(\.(\w+(\-\w+)?))\.(md|js)/;
    const matches  = fileNode.relativePath.match(regex);
    if(matches != null && matches.length >= 4) {
        const slug   = matches[1];
        const locale = matches[3];
        let   link   = `/${locale}`;
        if(slug != 'index')
            link += `/${slug}`;
        createNodeField({ node, name: `slug`,   value: slug   });
        createNodeField({ node, name: `locale`, value: locale });
        createNodeField({ node, name: `link`,   value: link   });
    }
    else {
        console.warn('\n', fileNode.relativePath, "doesn't matches the file name format.");
        console.log(matches);
    }
};

exports.onCreateNode = ({ node, getNode, actions }) => {
    const { createNodeField } = actions
    if (node.internal.type === `MarkdownRemark`) {
        const fileNode = getNode(node.parent);
        addNodeFields({ fileNode, createNodeField, node });
    }
    else if(node.internal.type === "File" && node.absolutePath != null && node.absolutePath !== undefined) {
        addNodeFields({ fileNode:node, createNodeField, node });
    }
    else if(node.internal.type === "Directory") {
//        console.log(node.relativePath);
    }
    else if(node.internal.type === "SitePage") {
//        console.log(node.relativePath);
    }
    else {
//        console.log(node.internal.type);
    }
}

exports.onCreatePage = ({ page, actions }) => {
    const { createPage, deletePage } = actions

    return new Promise(resolve => {
        const oldPage = Object.assign({}, page)
        // Remove trailing slash unless page is /
        const regex   = /(.*\/)*index\.(\w+(\-\w+)?)/;
        const matches = page.path.match(regex); 
        if(matches === null)
            return resolve();

        page.path = matches[1] + matches[2];

        if(page.path !== oldPage.path) {
            // Replace new page with old page
            deletePage(oldPage)
            createPage(page)
        }
        resolve()
    })
}

exports.createPages = ({ graphql, actions }) => {
    // **Note:** The graphql function call returns a Promise
    // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise for more info
    const { createPage } = actions
    return graphql(`{
        allMarkdownRemark {
            edges {
                node {
                    fields { slug, locale, link }
                }
            }
        }
    }`).then(result => {
        result.data.allMarkdownRemark.edges.forEach(({ node }) => {
            if(node.fields === undefined)
                console.log("This page is not valid", node);
            const { slug, locale, link } = node.fields;
            createPage({
                path: link,
                component: path.resolve(`./src/templates/recipe.js`),
                context: {
                    // Data pased to context is available
                    // in page queries as GraphQL variables
                    slug,
                    locale,
                    link
                }
            })
        })
    })
}

