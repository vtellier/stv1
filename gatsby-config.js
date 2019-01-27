module.exports = {
    siteMetadata: {
        title: `Steak-Tartare`,
        description: `Exclusively steak-tartare recipes, designed and approved for you`,
        author: `@vtellier`,
    },
    plugins: [
        `gatsby-plugin-react-helmet`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `gatsby-starter-default`,
                short_name: `starter`,
                start_url: `/`,
                background_color: `#663399`,
                theme_color: `#663399`,
                display: `minimal-ui`,
                icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `src`,
                path: `${__dirname}/src/`,
            },
        },
        {
            resolve: 'gatsby-plugin-i18n',
            options: {
                langKeyDefault: 'en',
                useLangKeyLayout: false,
                markdownRemark: {
                    postPage: 'src/templates/recipe.js',
                    query: `
                        {
                            allMarkdownRemark {
                                edges {
                                    node {
                                        fields {
                                            slug,
                                            langKey
                                        }
                                    }
                                }
                            }
                        }
                    `
                }
            }
        },
        `gatsby-transformer-remark`
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.app/offline
        // 'gatsby-plugin-offline',
    ],
}
