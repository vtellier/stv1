import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import { Divider } from '@material-ui/core'

import Header from './header'
import MenuDrawer from './MenuDrawer'
import './layout.css'

class Layout extends React.PureComponent {
    state = {
        menuOpen: false
    };
    merge = (allSitePage, allMarkdownRemark) => {
        let pages = allSitePage.reduce((acc, curr) => {
            acc[curr.context.pathDotLanguage] = { page:curr };
            return acc;
        },{});
        pages = allMarkdownRemark.reduce((acc, curr) => {
            if(acc[curr.fields.pathDotLanguage])
                Object.assign(acc[curr.fields.pathDotLanguage], { md:curr });
            else
                acc[curr.fields.pathDotLanguage] = { md:curr };
            return acc;
        }, pages);

        return pages;
    };
    render = () => {
        let { children, pageContext } = this.props;
        let { menuOpen } = this.state;
        let template = ({ site, allSitePage, allMarkdownRemark, nonCanonical }) => {
            allSitePage = allSitePage.edges.map(n => n.node);
            allMarkdownRemark = allMarkdownRemark.edges.map(n => n.node);
            let menuData = allMarkdownRemark;
            //let merged = this.merge(allSitePage, allMarkdownRemark);

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
                        menuData={ menuData }
                    />
                    {children}
                    <footer style={{textAlign:'center',padding:'1em'}}>
                        <Divider style={{margin:'1em'}} />
                        © {new Date().getFullYear()}
                    </footer>
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
                                    excerpt
                                    frontmatter {
                                        title
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
