import React from 'react';
import { 
    Link
} from 'gatsby';
import {
    Card,
    CardMedia,
    CardActionArea,
    CardContent,
    CardActions,
    Button
} from "@material-ui/core"

class CardRecipe extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        let {
            title,
            link,
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


