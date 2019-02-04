import React from 'react';
import {
    Card,
    CardMedia,
    CardContent
} from "@material-ui/core"

class CardRecipe extends React.PureComponent {
    render() {
        let {
            title,
            image
        } = this.props;
        return (
            <Card style={{display:'flex'}}>
                <CardMedia
                    style={{height:100,width:100}}
                    image={image}
                    title={title}
                />
                <CardContent>
                    The abstrat of the jævla recipe
                </CardContent>
            </Card>
        );
    }
}

export default CardRecipe;


