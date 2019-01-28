import React from 'react'
import { Link } from 'gatsby'
import Drawer from '@material-ui/core/Drawer';

class MenuDrawer extends React.PureComponent {
    render = () => {
        let {
            open,
            onClose,
            allSitePage,
            context
        } = this.props;

        allSitePage = allSitePage.reduce((acc,curr) => {
            if(curr.context && curr.context.locale === context.locale)
                acc.push(curr);
            return acc;
        },[]);

        return (
            <Drawer
                open={open}
                onClose={onClose}
            >
                { Array.isArray(allSitePage) &&
                    allSitePage.map(p => (
                        <Link key={'menu-link-'+p.slug} to={ p.path }>{ p.context.slug }</Link>
                    ))
                }
            </Drawer>
        );
    }
}

export default MenuDrawer;

