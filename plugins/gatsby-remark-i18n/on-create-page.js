const path = require('path');
const { createFilePath } = require(`gatsby-source-filesystem`);
const languageTagRegex = require('ietf-language-tag-regex');

// Work around https://github.com/sebinsua/ietf-language-tag-regex/issues/1
const isBcp47 = (tag) => tag !== 'html' && languageTagRegex().test(tag);

// By surveying the pages' creation, we'll intercept the indexes so that we
// can redirect them to their internationalized path
module.exports = ({ page, actions }, pluginOptions) => {
    const { createPage, deletePage } = actions

    return new Promise(resolve => {
        const oldPage = Object.assign({}, page)

        let locale  = pluginOptions.defaultLanguage;
        let newPath = page.path;
        let slug = "";
        const localeMatches = page.path.match(/(.*)(\.(\w+(\-\w+)?))/);

        if(localeMatches && localeMatches.length >= 4) {
            const explicitLocale = localeMatches[3];
            if(isBcp47(explicitLocale)) {
                locale = explicitLocale;
                slug = localeMatches[1];
            }
            else {
                slug = page.path;
            }
        }
        else {
            slug = page.path;
        }

        newPath = '/' + locale + slug;
        let canonical = newPath;

        // Handling the index pages
        const matches = page.path.match(/(.*\/)*index(\.[^\/]+)?/); 
        if(matches && matches.length >= 2) {
            slug = matches[1];
            canonical = '/' + locale + slug;
            newPath = canonical;

            // Creates the non canonical page
            if(pluginOptions.defaultLanguage === locale) {
                let defaultIndex = Object.assign({}, page)
                defaultIndex.path = matches[1];
                defaultIndex.context = Object.assign({}, page.context);
                defaultIndex.context.locale = locale;
                defaultIndex.context.canonical = canonical;
                defaultIndex.context.slug = slug;
                defaultIndex.context.pathRegex = '/'+slug+'/';
                createPage(defaultIndex);
            }
        }

        page.path = newPath;
        page.context.locale = locale;
        page.context.canonical = canonical;
        page.context.slug = slug;
        page.context.pathRegex = '/'+slug.substring(1).replace('/','\/')+'/';

        deletePage(oldPage);
        createPage(page);

        resolve();
    })
}
