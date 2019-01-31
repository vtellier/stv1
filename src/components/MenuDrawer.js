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
            if(!curr.context
            || curr.context.locale !== context.locale
            || curr.translationId === null
            || curr.menuData === null || curr.menuData === undefined)
                return acc;

            if(!curr.menuData.menuText || !curr.menuData.menuTitle || !curr.menuData.menuOrder) {
                throw new Error(`The page ${curr.path} must provide the following ` +
                                `frontmatter properties: menuText, menuTitle and menuOrder`);
            }

            acc.push(curr);
            return acc;
        },[]);

        allSitePage.sort((e1,e2) => e1.menuData.menuOrder < e2.menuData.menuOrder ? -1 : 0);

        return (
            <Drawer
                open={open}
                onClose={onClose}
            >
                { Array.isArray(allSitePage) &&
                    allSitePage.map(p => (
                        <Link
                            key={'menu-link-'+p.context.slug}
                            to={ p.path }
                            title={p.menuData.menuTitle}
                        >
                            { p.menuData.menuText }
                        </Link>
                    ))
                }
            </Drawer>
        );
    }
}

export default MenuDrawer;

