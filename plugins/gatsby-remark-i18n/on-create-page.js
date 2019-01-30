const path = require('path');
const { createFilePath } = require(`gatsby-source-filesystem`);
const PathFinder = require('./PathFinder');

// By surveying the pages' creation, we'll intercept the indexes so that we
// can redirect them to their internationalized path
module.exports = ({ page, actions }, pluginOptions) => {
    const { createPage, deletePage } = actions

    return new Promise(resolve => {
        const oldPage = Object.assign({}, page)

        let pf = new PathFinder(page, pluginOptions.defaultLanguage);

        deletePage(oldPage);
        pf.getPages().forEach(p => createPage(p));

        resolve();
    })
}
