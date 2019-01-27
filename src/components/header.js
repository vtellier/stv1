import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'

import {
    AppBar,
    Toolbar,
    IconButton
} from '@material-ui/core';
import { Menu } from '@material-ui/icons';

const Header = ({ siteTitle }) => (
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
        </Toolbar>
    </AppBar>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
