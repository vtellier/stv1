/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require('path')
const { createFilePath } = require(`gatsby-source-filesystem`)
const config = require('./gatsby-config');

const addNodeFields = ({ fileNode, createNodeField, node }) => {
    const regex    = /pages\/(.*)(\.(\w+(\-\w+)?))\.(md|js)/;
    const matches  = fileNode.relativePath.match(regex);
    if(matches != null && matches.length >= 4) {
        const slug   = matches[1];
        const locale = matches[3];
        let   link   = `/${locale}`;
        if(slug != 'index')
            link += `/${slug}`;

        console.log(fileNode.relativePath, slug, locale, link);

        createNodeField({ node, name: `slug`,   value: slug   });
        createNodeField({ node, name: `locale`, value: locale });
        createNodeField({ node, name: `link`,   value: link   });
    }
    else {
        //console.warn('\n', fileNode.relativePath, "doesn't matches the file name format.");
        //console.log(matches);
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
}

exports.onCreatePage = ({ page, actions }) => {
    const { createPage, deletePage } = actions

    return new Promise(resolve => {
        const oldPage = Object.assign({}, page)
        const matches = page.path.match(/(.*\/)*index\.(\w+(\-\w+)?)/); 

        if(Array.isArray(matches) && matches.length >= 3) {
            // index pages
            page.path = matches[1] + matches[2];
            page.context.slug = matches[1];
            page.context.locale = matches[2];
            page.context.link = page.path;

            if(config.siteMetadata.defaultLanguage === page.context.locale) {
                let defaultIndex = Object.assign({}, page)
                defaultIndex.context = Object.assign({}, page.context);
                defaultIndex.context.canonical = page.path;
                defaultIndex.path = matches[1];
                createPage(defaultIndex);
                //console.log(`created`, defaultIndex);
            }
        }

        if(page.path !== oldPage.path) {
            // Replace new page with old page
            deletePage(oldPage)
            createPage(page)
            //console.log(`created page`, page);
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
                    fileAbsolutePath
                    fields { slug, locale, link }
                    frontmatter { template }
                }
            }
        }
    }`).then(result => {
        if(!result.data)
            throw new Error(`No markdown page has been returned, please ensure they
                            fullfill the following frontmatter fields:
                                - template`);
        result.data.allMarkdownRemark.edges.forEach(({ node }) => {
            if(node.fields === undefined)
                console.log("This page is not valid", node);
            const { slug, locale, link } = node.fields;
            const { template } = node.frontmatter;
            if(!template) throw new Error(`No template has been specified in the
                                          frontmatter of ${node.fileAbsolutePath}`);
            createPage({
                path: link,
                component: path.resolve(`./src/templates/${template}`),
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

