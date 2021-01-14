import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
//import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
//import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
    root: {
        // flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
      //  margin: "0.5rem auto",
        maxWidth: "600px",
        margin: theme.spacing(1),
    },

    textFieldWidth: {
        width: "calc(90% - 25px)",
        maxWidth: "400px",
    }
}));
function SearchMessages() {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <TextField
                id="input-with-icon-grid"
                label="With a grid"
                className={classes.textFieldWidth}
            />
            <SearchIcon />
        </div>

    );
}

export default SearchMessages;