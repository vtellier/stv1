import React from 'react'
import { Link } from 'gatsby'
import { List, ListItem, ListItemText } from '@material-ui/core'; 

export class MenuRender extends React.PureComponent {
    render = () => {
        const tree = this.props.tree;

        const p = tree.page;
        const children = Object.values(tree.children);

        console.log(p, children);

        return (
            <>
                { p !== null && (
                    <ListItem button>
                        { typeof p === 'string' &&
                            <span>{p}</span>
                        }
                        { typeof p === 'object' &&
                            <Link
                                to={ p.path }
                                title={p.menuData.menuTitle}
                            >
                                <ListItemText> { p.menuData.menuText } </ListItemText>
                            </Link>
                        }
                    </ListItem>
                )}
                { children.length > 0 && (
                    <List component="nav" style={{}}>
                    { children.map(child => (
                            <MenuRender key={child.key} tree={child} />
                        )) }
                    </List>
                ) }
            </>
        );
    }
}

export class MenuTree {
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
}

export default { MenuTree, MenuRender };

