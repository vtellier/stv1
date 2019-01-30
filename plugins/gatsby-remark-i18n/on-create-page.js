const path = require('path');
const { createFilePath } = require(`gatsby-source-filesystem`);
const languageTagRegex = require('ietf-language-tag-regex');


class PathFinder {
    constructor(page, defaultLanguage) {
        this.page = page;
        this.defaultLanguage = defaultLanguage || 'en';

        const pathItems = this.page.path.split('/');

        this.explosedSlug = pathItems.reduce((acc,curr) => {
            if(curr != '')
                acc.push(curr);
            return acc;
        }, []);
        this.fileName = this.explosedSlug.pop();
        
        const pathLocale = this.getLocaleFromPath();
        if(pathLocale !== null)
            this.fileName = this.fileName.substring(0,this.fileName.length - pathLocale.length-1);

        if(this.fileName !== 'index')
            this.explosedSlug.push(this.fileName);
    }

    // Work around https://github.com/sebinsua/ietf-language-tag-regex/issues/1
    isBcp47(tag) {
        return tag !== 'html' && languageTagRegex().test(tag);
    }

    getLocaleFromPath() {
        const localeMatches = this.page.path.match(/(.*)(\.(\w+(\-\w+)?))/);

        if(localeMatches && localeMatches.length >= 4) {
            const locale = localeMatches[3];
            if(this.isBcp47(locale)) {
                return locale;
            }
        }

        return null;
    }

    getLocale() {
        return this.getLocaleFromPath() || this.defaultLanguage;
    }

    getSlug() {
        return '/' + this.explosedSlug.join('/');
    }

    getCanonical() {
        let slugCopy = this.explosedSlug.slice(0);
        slugCopy.unshift(this.getLocale());
        return '/' + slugCopy.join('/');
    }

    getAll() {
        return {
            locale:    this.getLocale(),
            slug:      this.getSlug(),
            canonical: this.getCanonical()
        };
    }
}

const isBcp47 = (tag) => {
    return tag !== 'html' && languageTagRegex().test(tag);
}

// By surveying the pages' creation, we'll intercept the indexes so that we
// can redirect them to their internationalized path
module.exports = ({ page, actions }, pluginOptions) => {
    const { createPage, deletePage } = actions


    return new Promise(resolve => {
        const oldPage = Object.assign({}, page)

        let pf = new PathFinder(page, pluginOptions.defaultLanguage);
        console.log(page.path, 'PathFinder:', pf.getAll());

        let {
            locale,
            slug
        } = pf.getAll();

        let newPath = '/' + locale + slug;
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
