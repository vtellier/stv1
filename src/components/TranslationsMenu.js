import React from 'react'
import { Link } from 'gatsby'
import Flag from 'react-country-flag'


import {
    IconButton,
    Menu, MenuItem
} from '@material-ui/core';
import TranslateIcon from '@material-ui/icons/Translate';

export class TranslationsMenu extends React.PureComponent {
    state = {
        anchorEl: null,
    };
    render() {
        let { translations } = this.props;
        let { anchorEl } = this.state;
        let opened = Boolean(anchorEl);

        if(!translations || translations.length === 0)
            return null;

        translations = translations.map(tr => {
            tr.iso3166 = tr.context.locale.toUpperCase();
            const split = tr.iso3166.split('-');
            if(split.length > 1)
                tr.iso3166 = split[1];
            return tr;
        });

        return (
            <>
                <IconButton
                    aria-label="Translations"
                    color="inherit"
                >
                    <TranslateIcon />
                </IconButton>
                { translations.map(tr => (
                    <IconButton key={'translation-'+tr.path} component={Link} to={tr.path}>
                        <Flag
                            cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/"
                            styleProps={{ width: "24px", height: "24px" }}
                            code={ tr.iso3166 }
                            svg
                        />
                    </IconButton>
                )) }
            </>
        );
    }
}

