import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Header from './header'
import MenuDrawer from './MenuDrawer'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#484848',
      main: '#212121',
      dark: '#000000',
      contrastText: '#fff',
    },
    secondary: {
      light: '#f05545',
      main: '#b71c1c',
      dark: '#7f0000',
      contrastText: '#fff',
    },
  },
});

class Layout extends React.Component {
    state = {
        menuOpen: false
    };
    render = () => {
        let { children, pageContext } = this.props;
        let { menuOpen } = this.state;
        let template = ({ site, allSitePage, allMarkdownRemark, nonCanonical }) => {
            allSitePage = allSitePage.edges.map(n => n.node);
            let menuData = allMarkdownRemark.edges.map(n => n.node);

            menuData = menuData.reduce((acc,curr) => {
                acc[curr.fields.pathDotLanguage] = curr.frontmatter;
                return acc;
            }, {});

            allSitePage = allSitePage.reduce((acc,curr) => {
                if(curr.context) {
                    curr.menuData = menuData[curr.context.pathDotLanguage];
                    acc.push(curr);
                }
                else {
                    console.warn(`No context for this page:`, curr);
                }
                return acc;
            },[]);


            return (
                <MuiThemeProvider theme={theme}>
                    <Header
                        pageContext={ pageContext }
                        siteTitle={ site.siteMetadata.title }
                        allSitePage={ allSitePage }
                        onMenuOpen={ () => this.setState({ menuOpen: true }) }
                    />
                    <MenuDrawer
                        open={ menuOpen }
                        onClose={ () => { this.setState({ menuOpen:false }) } }
                        allSitePage={ allSitePage }
                        pageContext={ pageContext }
                        menuData={menuData} />
                    <div
                        style={{
                            margin: `20px auto 0 auto`,
                            maxWidth: 960,
                            padding: `0px 1.0875rem 1.45rem`,
                            paddingTop: 0,
                        }}
                    >
                        {children}
                        <footer> © {new Date().getFullYear()} </footer>
                    </div>
                </MuiThemeProvider>
            );
        }
        return (
            <StaticQuery
                query={graphql` query SiteMetaDataQuery
                    {
                        site {
                            siteMetadata { title }
                        }

                        allSitePage (
                            filter: {
                                context: {
                                    canonical: {
                                        eq: null
                                    }
                                }
                            }
                        ){
                            edges {
                                node {
                                    id
                                    path
                                    context {
                                        slug
                                        locale
                                        canonical
                                        pathRegex
                                        pathDotLanguage
                                    } 
                                }
                            }
                        }

                        allMarkdownRemark {
                            edges {
                                node {
                                    fields { pathDotLanguage }
                                    frontmatter {
                                        menuOrder
                                        menuText
                                        menuTitle
                                    }
                                }
                            }
                        }
                    } `}
                render={template}
            />
        )
    }
}

export default Layout
