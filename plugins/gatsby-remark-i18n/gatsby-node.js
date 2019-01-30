/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require('path');
const { createFilePath } = require(`gatsby-source-filesystem`);
const languageTagRegex = require('ietf-language-tag-regex');


// By surveying the pages' creation, we'll intercept the indexes so that we
// can redirect them to their internationalized path
exports.onCreatePage = ({ page, actions }, pluginOptions) => {
    const { createPage, deletePage } = actions

    console.log('plugin onCreatePage', page.path);

    return new Promise(resolve => {
        const oldPage = Object.assign({}, page)

        let locale  = pluginOptions.defaultLanguage;
        let newPath = page.path;
        const localeMatches = page.path.match(/(.*)(\.(\w+(\-\w+)?))/);

        if(localeMatches && localeMatches.length >= 4) {
            const explicitLocale = localeMatches[3];
            if(languageTagRegex().test(explicitLocale)) {
                locale = explicitLocale;
                newPath = localeMatches[1];
            }
        }
        else {
            console.log('does not matches: ', localeMatches);
        }

        newPath = '/' + locale + newPath;
        let canonical = newPath;

        // Handling the index pages
        const matches = page.path.match(/(.*\/)*index(\.[^\/]+)?/); 
        if(matches && matches.length >= 2) {
            canonical = locale + matches[1];
            newPath = canonical;

            // Creates the non canonical page
            if(pluginOptions.defaultLanguage === locale) {
                let defaultIndex = Object.assign({}, page)
                defaultIndex.path = matches[1];
                defaultIndex.context = Object.assign({}, page.context);
                defaultIndex.context.canonical = canonical;
                console.log('Creating non canonical page', defaultIndex.path);
                createPage(defaultIndex);
            }
        }

        page.path = newPath;
        page.context.locale = locale;
        page.context.canonical = canonical;

        deletePage(oldPage);
        createPage(page);

        resolve();
    })
}

