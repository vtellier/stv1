import { Link, StaticQuery, graphql } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import { TranslationsMenu } from '../components/TranslationsMenu';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    withStyles
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';


const GenerateTranslations = (context, nodes) => {
    const filtered = nodes.reduce((acc,curr) => {
        if(!curr.context) {
            console.warn("Invalid page: ", curr);
            return acc;
        }
        if(curr.context.slug === context.slug
        && curr.context.locale !== context.locale)
            acc.push(curr);
        return acc;
    }, []);

    return ( <TranslationsMenu translations={ filtered } />);
}

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

const Header = ({ context, siteTitle, classes }) => {

    const render = data => {
        const { allSitePage } = data;

        const translations = GenerateTranslations(context, allSitePage.edges.map(n => n.node));

        return (
                <AppBar position="static">
                    <Toolbar>
                        <IconButton color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            <Link
                                to="/"
                                style={{
                                    color: `white`,
                                    textDecoration: `none`,
                                }}
                            >
                                {siteTitle}
                            </Link>
                        </Typography>
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
    classes: PropTypes.object.isRequired,
}

Header.defaultProps = {
    siteTitle: ``,
}

export default withStyles(styles)(Header)
