import React, { useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import { toggleLeftSidebarAction } from '../../../store/actions/toggle'
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    }
}));


function Hamburger() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const isDesktopView = useMediaQuery('(min-width:960px)');

    useEffect(() => {
        if (isDesktopView)
            dispatch(toggleLeftSidebarAction(false))
    }, [isDesktopView, dispatch /*, toggleLeftSidebarAction*/])

    return (isDesktopView)
        ? null
        : (
            <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
                onClick={() => dispatch(toggleLeftSidebarAction(true))}
            >
                <MenuIcon />
            </IconButton>
        );
}

export default Hamburger;