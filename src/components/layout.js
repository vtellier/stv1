import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'


import Header from './header'
import './layout.css'


const Layout = ({ children, context }) => {
    let template = data => {
        console.log(context);
        return (
            <>
                <Header context={context} siteTitle={data.site.siteMetadata.title} />
                <div
                style={{
                    margin: `0 auto`,
                    maxWidth: 960,
                    padding: `0px 1.0875rem 1.45rem`,
                    paddingTop: 0,
                }}
                >
                {children}
                <footer>
                    © {new Date().getFullYear()}
                </footer>
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
                } `}
            render={template}
        />
        )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  context: PropTypes.object.isRequired
}

export default Layout
