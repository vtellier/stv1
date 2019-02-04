import React from 'react'
import MenuTree from './MenuTree'
import {
    Drawer
} from '@material-ui/core';

class MenuDrawer extends React.PureComponent {
    filterPageData(allSitePage, pageContext) {
        if(!pageContext)
            return [];
        return allSitePage.reduce((acc,curr) => {
            if(!curr.context
            || curr.context.locale !== pageContext.locale
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
    }

    render = () => {
        let {
            open,
            onClose,
            allSitePage,
            pageContext
        } = this.props;

        allSitePage = this.filterPageData(allSitePage, pageContext);
        allSitePage.sort((e1,e2) => e1.menuData.menuOrder < e2.menuData.menuOrder ? -1 : 0);

        let menuTree = new MenuTree();
        allSitePage.forEach(p => menuTree.addPage(p, p.context.slug));

        return (
            <Drawer
                open={open}
                onClose={onClose}
            >
                { menuTree.render() }
            </Drawer>
        );
    }
}

export default MenuDrawer;

