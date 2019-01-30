const path = require('path')

exports.onCreatePage = ({ page, actions }, pluginOptions) => {
    const { createPage, deletePage } = actions

    console.log('user onCreatePage',page.path, page.context);
};

exports.onCreateNode = ({ node, getNode, actions, }, configOptions ) => {
    const { createNodeField } = actions;

    console.log('user onCreateNode', node.internal.type);

    if (node.internal.type !== `MarkdownRemark`)
        return;

    const fileNode = getNode(node.parent);
    const regex    = /pages\/(.*)\.md/;
    const matches  = fileNode.relativePath.match(regex);
    if(matches != null && matches.length >= 1) {
        const slug = matches[1];
        createNodeField({ node, name: `slug`, value: slug });
    }
};

exports.createPages = ({ graphql, actions }, pluginOptions) => {
    const { createPage } = actions

    console.log('USER createPages');

    return graphql(`{
        allMarkdownRemark {
            edges {
                node {
                    fileAbsolutePath
                    fields { slug }
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
            const { slug, locale, link } = node.fields;
            const { template } = node.frontmatter;
            if(!template) throw new Error(`No template has been specified in the
                                          frontmatter of ${node.fileAbsolutePath}`);

            const regex   = /(.*)(\.[^\/\.]+)/;
            const matches = slug.match(regex);

            let filesRegex = '/'+slug+'/';
            if(matches)
                filesRegex = '/'+matches[1]+'/';

            console.log('filesRegex', filesRegex);

            createPage({
                path: node.fields.slug,
                component: path.resolve(`./src/templates/${template}`),
                context: {
                    slug,
                    filesRegex
                }
            })

        })
    })
};

