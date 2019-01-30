const path = require('path')

exports.onCreatePage = ({ page, actions }, pluginOptions) => {
    const { createPage, deletePage } = actions
};

exports.onCreateNode = ({ node, getNode, actions, }, configOptions ) => {
    const { createNodeField } = actions;

    if (node.internal.type !== `MarkdownRemark`)
        return;

    const fileNode = getNode(node.parent);
    const regex    = /pages\/(.*)\.md/;
    const matches  = fileNode.relativePath.match(regex);
    if(matches != null && matches.length >= 1) {
        const pathDotLanguage = matches[1];
        createNodeField({ node, name: `pathDotLanguage`, value: pathDotLanguage });
    }
};

exports.createPages = ({ graphql, actions }, pluginOptions) => {
    const { createPage } = actions

    return graphql(`{
        allMarkdownRemark {
            edges {
                node {
                    fileAbsolutePath
                    fields { pathDotLanguage }
                    frontmatter { template }
                }
            }
        }
    }`).then(result => {
        if(!result.data) {
            throw new Error(`No markdown page has been returned, please ensure they
                            fullfill the following frontmatter fields:
                                - template`);
        }

        result.data.allMarkdownRemark.edges.forEach(({ node }) => {
            const { pathDotLanguage } = node.fields;
            const { template } = node.frontmatter;
            if(!template) throw new Error(`No template has been specified in the
                                          frontmatter of ${node.fileAbsolutePath}`);

            createPage({
                path: pathDotLanguage,
                component: path.resolve(`./src/templates/${template}`),
                context: { pathDotLanguage }
            })

        })
    })
};

