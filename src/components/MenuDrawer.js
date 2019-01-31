import React from 'react'
import { Link } from 'gatsby'
import Drawer from '@material-ui/core/Drawer';

class MenuTree {
    constructor(key) {
        this.key = key || '';
        this.page = null;
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
                child = new MenuTree(this.key + '/' + link);
                this.children[link] = child;
            }
            child.addPage(page, explodedPath.join('/'));
        }
        else
            this.page = page;
    }
    renderPage() {
        if(this.page === null)
            return null;

        const p = this.page;
        return (
            <Link
                key={'menu-link-'+p.context.slug}
                to={ p.path }
                title={p.menuData.menuTitle}
            >
                { p.menuData.menuText }
            </Link>
        );
    }
    renderChildren() {
        return (
            <ul>
                { Object.values(this.children).map(tree => (
                    <li key={tree.key}> { tree.render() } </li>
                ))}
            </ul>
        );
    }
    render() {
        return (
            <>
                { this.renderPage() }
                { this.renderChildren() }
            </>
        );
    }
}

class MenuDrawer extends React.PureComponent {
    filterPageData(allSitePage, context) {
        return allSitePage.reduce((acc,curr) => {
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
    }

    render = () => {
        let {
            open,
            onClose,
            allSitePage,
            context
        } = this.props;

        allSitePage = this.filterPageData(allSitePage, context);
        allSitePage.sort((e1,e2) => e1.menuData.menuOrder < e2.menuData.menuOrder ? -1 : 0);

        let menuTree = new MenuTree();
        allSitePage.forEach(p => menuTree.addPage(p, p.context.slug));

        console.log(menuTree);

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

