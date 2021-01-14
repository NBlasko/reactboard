import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
//import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles({
    root: {
        minWidth: "80px",
    },
});



function OrderByMessages() {

    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (

        <Tabs
            // className={classes.root}
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
        >
            <Tab label="Date"  className={classes.root}/>
            <Tab label="Views"  className={classes.root}/>
            <Tab label="Likes"  className={classes.root}/>
        </Tabs>

    );
}

export default OrderByMessages;
