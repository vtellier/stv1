import React from 'react'
import {
    Link
} from 'gatsby'
import {
    Drawer,
    List,
    ListItem,
//    ListItemIcon,
    ListItemText
} from '@material-ui/core';

class MenuTree {
    constructor(key, link) {
        this.key = key || '';
        this.page = link || null;
        this.children = {};
    }
    getChild(link) {
        return this.children[link];
    }
    addPage(page, path) {
        if(path === '') {
            this.page = page;
            return;
        }

        if(path[0] === '/')
            path = path.substring(1);

        let explodedPath = path.split('/');

        if(explodedPath.length > 0) {
            const link = explodedPath.shift();
            let child = this.children[link];
            if(!child) {
                child = new MenuTree(this.key + '/' + link, link);
                this.children[link] = child;
            }
            child.addPage(page, explodedPath.join('/'));
        }
        else
            this.page = page;
    }
    renderPage() {
        const p = this.page;
        if(p === null)
            return null;
        else if(typeof p === 'string')
            return (<span>{ p }</span>);
        else
            return (
                <Link
                    key={'menu-link-'+p.context.slug}
                    to={ p.path }
                    title={p.menuData.menuTitle}
                >
                    <ListItemText primary={ p.menuData.menuText } />
                </Link>
            );
    }
    renderChildren() {
        return (
            <List>
                { Object.values(this.children).map(tree => (
                    <ListItem key={tree.key}>
                        { tree.render() }
                    </ListItem>
                ))}
            </List>
        );
    }
    render() {
        const childrenArray = Object.values(this.children);

        if(childrenArray.length === 0)
            return this.renderPage();
        
        return (
            <List
                component="nav"
                subheader={ this.renderPage() }
            >
                { this.renderChildren() }
            </List>
        );
    }
}

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

