import React from 'react'
import { Link } from 'gatsby'

import {
    IconButton,
    Menu, MenuItem
} from '@material-ui/core';
import TranslateIcon from '@material-ui/icons/Translate';

export class TranslationsMenu extends React.PureComponent {
    state = {
        anchorEl: null,
    };
    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };
    handleClose = () => {
        this.setState({ anchorEl: null });
    };
    render() {
        let { translations } = this.props;
        let { anchorEl } = this.state;
        let opened = Boolean(anchorEl);
        return (
            <>
                <IconButton
                    aria-label="Translations"
                    aria-owns={opened ? 'menu-translations-appbar' : undefined}
                    aria-haspopup="true"
                    onClick={ this.handleClick }
                    color="inherit"
                >
                    <TranslateIcon />
                </IconButton>
                <Menu
                    id="menu-translations-appbar"
                    open={ opened }
                    onClose={ this.handleClose }
                    anchorEl={ anchorEl }
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    { translations.map(tr => (
                        <MenuItem key={'tr-'+tr.id}>
                            <Link to={tr.path}>
                                { tr.context.locale }
                            </Link>
                        </MenuItem>
                    )) }
                </Menu>
            </>
        );
    }
}

