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
                name: `Steak Tartare`,
                short_name: `Tartare`,
                start_url: `/`,
                background_color: `#FFFFFF`,
                theme_color: `#000`,
                display: `standalone`,
                icon: `src/images/icon.png`, // This path is relative to the root of the site.
                include_favicon: true
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `src`,
                path: `${__dirname}/src/`,
            },
        },
        `gatsby-transformer-remark`,
        {
            resolve: `gatsby-plugin-intl-url`,
            options: {
                defaultLanguage: 'en'
            }
        },
        {
        resolve: `@wapps/gatsby-plugin-material-ui`,
            options: {
                productionPrefix: 'c',
                theme: {
                    palette: {
                        primary: {
                            dark:         '#000000',
                            light:        '#484848',
                            main:         '#212121',
                            contrastText: '#ffffff',
                        },
                        secondary: {
                            dark:         '#7f0000',
                            light:        '#f05545',
                            main:         '#b71c1c',
                            contrastText: '#ffffff',
                        },
                    },
                    typography: {
                        useNextVariants: true,
                    },
                },
            },
        },
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.app/offline
        // 'gatsby-plugin-offline',
    ],
}
