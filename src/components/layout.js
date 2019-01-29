import React from 'react'
import { StaticQuery, graphql } from 'gatsby'

import Header from './header'
import MenuDrawer from './MenuDrawer'
import './layout.css'

class Layout extends React.Component {
    state = {
        menuOpen: false
    };
    render = () => {
        let { children, context } = this.props;
        let { menuOpen } = this.state;
        console.log(`I am ${!context.canonical ? ' ': 'not '}the canonical url`);
        let template = ({ site, allSitePage }) => {
            allSitePage = allSitePage.edges.map(n => n.node);
            console.log(context);
            return (
                <>
                    <Header
                        context={ context }
                        siteTitle={ site.siteMetadata.title }
                        allSitePage={ allSitePage }
                        onMenuOpen={ () => this.setState({ menuOpen: true }) }
                    />
                    <MenuDrawer
                        open={ menuOpen }
                        onClose={ () => { this.setState({ menuOpen:false }) } }
                        allSitePage={ allSitePage }
                        context={context} />
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
                        allSitePage {
                            edges {
                                node {
                                    id
                                    path
                                    context {
                                        slug
                                        locale
                                        link
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
