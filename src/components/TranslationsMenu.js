import React from 'react'
import { Link } from 'gatsby'
import Flag from 'react-country-flag'
import codes from 'cjs-iso-639'


import { IconButton } from '@material-ui/core';
import TranslateIcon from '@material-ui/icons/Translate';

export class TranslationsMenu extends React.PureComponent {
    render() {
        let { translations } = this.props;

        if(!translations || translations.length === 0)
            return null;

        translations = translations.map(tr => {
            tr.iso3166 = tr.context.locale.toUpperCase();
            const split = tr.iso3166.split('-');
            if(split.length > 1)
                tr.iso3166 = split[1];
            else if(tr.iso3166 === 'EN')
                tr.iso3166 = 'GB';
            tr.langName = tr.context.locale;
            const names = codes['1'][tr.context.locale.toLowerCase()];
            if(names) {
                if(names.length > 1)
                    tr.langName = names[1];
                else if(names.length > 0)
                    tr.langName = names[0];
            }
            return tr;
        });

        return (
            <>
                <TranslateIcon />
                { translations.map(tr => (
                    <IconButton key={'translation-'+tr.path} component={Link} to={tr.path} title={tr.langName}>
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

