import React from 'react'
import Drawer from '@material-ui/core/Drawer';

class MenuDrawer extends React.PureComponent {
    state = {
    };
    onClose() {
        console.log('close');
    }
    render = () => {
        let {
            open
        } = this.props;
        return (
            <Drawer
                open={open}>
                Menu
            </Drawer>
        );
    }
}

export default MenuDrawer;

