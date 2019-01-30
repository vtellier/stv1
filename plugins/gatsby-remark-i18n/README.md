# gatsby-remark-i18n

This [Gatsby][1] plugin extends the [gatsby-transform-remark][2] enables you to internationalize your website.

- [x] Support the [BCP47](https://tools.ietf.org/html/bcp47) tags for identifying languages
- [x] Defines a non canonical duplicate page for the main index page
  - [x] This is done at all level of your arborescence
  - [ ] The canonical link in the header is injected to signal the search engines crawlers register the right address
- [ ] Include the locale tag in the path of untranslated pages with the default language
- [x] Configurable defautl language

## What it does

It injects the [locale][3] of your pages in the base path of the URL, your tree will look like that:

> www.example.com/en/hello
> www.example.com/en-US/hello
> www.example.com/fr/hello


[1]: gatsbyjs.org
[2]: https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-transformer-remark
[3]: https://formatjs.io/guides/basic-i18n/#locales

