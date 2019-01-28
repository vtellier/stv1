import { Link, StaticQuery, graphql } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'

import {
    AppBar,
    Toolbar,
    IconButton
} from '@material-ui/core';
import { Menu } from '@material-ui/icons';

const GenerateTranslations = (context, nodes) => {
    const filtered = nodes.reduce((acc,curr) => {
        if(!curr.context) {
            console.log("SHitty paage: ", curr);
            return acc;
        }
        console.log(curr);
        if(curr.context.slug === context.slug
        && curr.context.locale != context.locale)
            acc.push(curr);
        return acc;
    }, []);

    return (
        <div>
            { filtered.map(tr => ( <Link key={'tr-'+tr.id} to={tr.path}>{ tr.context.locale }</Link>)) }
        </div>
    );
}

const Header = (...args) => {
    console.log('header', args);
    const { siteTitle, context } = args[0];

    const render = data => {
        const { allSitePage } = data;

        const translations = GenerateTranslations(context, allSitePage.edges.map(n => n.node));

        console.log(data);
        return (
                <AppBar position="static">
                    <Toolbar>
                        <IconButton color="inherit" aria-label="Menu">
                            <Menu />
                        </IconButton>
                        <h1 style={{ margin: 0 }}>
                        <Link
                            to="/"
                            style={{
                                color: `white`,
                                textDecoration: `none`,
                            }}
                        >
                            {siteTitle}
                        </Link>
                        </h1>
                        { translations }
                    </Toolbar>
                </AppBar>
            );
    }

    return (
        <StaticQuery
            query={
                graphql` query {
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
                    }
                ` }
            render={ render }
        />
    );
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
