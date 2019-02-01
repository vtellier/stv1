import React from 'react'
import { StaticQuery, graphql } from 'gatsby'

import Header from './header'
import MenuDrawer from './MenuDrawer'

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
                <>
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
                </>
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
