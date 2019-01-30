const path = require('path');
const { createFilePath } = require(`gatsby-source-filesystem`);
const languageTagRegex = require('ietf-language-tag-regex');


class PathFinder {
    constructor(page, defaultLanguage) {
        this.page = Object.assign({},page);
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
        //if(this.getLocale() !== this.defaultLanguage)
        slugCopy.unshift(this.getLocale());
        return '/' + slugCopy.join('/');
    }

    getPathRegex() {
        let regex = this.explosedSlug.join('/');
        regex = regex.replace('/','\/');
        return '/' + regex + '/';
    }

    getPaths() {
        let paths = [];
        paths.push(this.getCanonical());
        if(this.getLocale() === this.defaultLanguage) {
            if(this.fileName === 'index')
                paths.push(this.getSlug());
        }
        return paths;
    }
    
    getPages() {
        return this.getPaths().map(p => {
            let newPage = Object.assign({},this.page);
            newPage.path              = p;
            newPage.context.locale    = this.getLocale();
            newPage.context.canonical = this.getCanonical();
            newPage.context.slug      = this.getSlug();
            newPage.context.pathRegex = this.getPathRegex();
            return newPage;
        });
    }

    getAll() {
        return {
            locale:    this.getLocale(),
            slug:      this.getSlug(),
            canonical: this.getCanonical(),
            paths:     this.getPaths()
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

        deletePage(oldPage);
        pf.getPages().forEach(p => createPage(p));

        resolve();
    })
}
