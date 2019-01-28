import React from 'react'

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
        console.log(event);
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
            <div>
                <IconButton
                    aria-label="Translations"
                    onClick={ this.handleClick }
                >
                    <TranslateIcon />
                </IconButton>
                <Menu
                    open={ opened }
                    onClose={ this.handleClose }
                    anchorEl={ anchorEl }
                >
                    { translations.map(tr => (
                        <MenuItem key={'tr-'+tr.id} to={tr.path}>{ tr.context.locale }</MenuItem>
                    )) }
                </Menu>
            </div>
        );
    }
}

