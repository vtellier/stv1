import { Link, StaticQuery, graphql } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import { TranslationsMenu } from '../components/TranslationsMenu';
import {
    AppBar,
    Toolbar,
    IconButton,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';


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

    return ( <TranslationsMenu translations={ filtered } />);
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
                            <MenuIcon />
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
