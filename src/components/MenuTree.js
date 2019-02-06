import React from 'react'
import { navigate } from 'gatsby'
import { List, ListItem, ListItemText, Divider } from '@material-ui/core'; 

export class MenuRender extends React.PureComponent {
    onClick = (path) => {
        if(this.props.onClick)
            this.props.onClick();
        navigate(path);
    }
    render = () => {
        const onClick = this.props.onClick;
        const tree = this.props.tree;

        const p = tree.page;
        const children = Object.values(tree.children);

        return (
            <>
                { p !== null && (
                    <ListItem button onClick={() => this.onClick(p.path) }>
                        { typeof p === 'string' &&
                            <span>{p}</span>
                        }
                        { typeof p === 'object' &&
                            <ListItemText> { p.menuData.menuText } </ListItemText>
                        }
                    </ListItem>
                )}
                { children.length > 0 && (
                    <>
                        <Divider />
                        <List component="nav" style={{paddingLeft:'1em'}}>
                        { children.map(child => (
                                <MenuRender key={child.key} tree={child} onClick={onClick} />
                            )) }
                        </List>
                    </>
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

