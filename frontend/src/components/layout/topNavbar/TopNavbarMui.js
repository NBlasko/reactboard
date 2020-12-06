import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
//import '../../../css/Navbar.css';
import { addUserProfile } from '../../../store/actions';
import ProfileDropdown from './ProfileDropdown';

// import SearchBar from './SearchBar';
// import DropdownNav from './DropdownNav';


import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Hamburger from './Hamburger';


import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
    toolbar: {
        minHeight: 48
    }
}));



function TopNavbar() {
    const classes = useStyles();
    let isSendFetchUser = useRef(false);
    const setIsOpen = useState(false)[1];

    const dispatch = useDispatch();
    const publicID = useSelector(state => state.user.publicID);


    useEffect(() => {
        if (
            !publicID
            && localStorage.reactBoardToken
            && !isSendFetchUser.current
        ) {
            isSendFetchUser.current = true;
            dispatch(addUserProfile());
        }
    })


    useEffect(() => {
        if (publicID)
            isSendFetchUser.current = false;
    }, [publicID])

    // const toggle = () => {
    //     setIsOpen(prevState => !prevState);
    // }

    const closeToggle = () => {
        setIsOpen(false);
    }

    return (
        <div className={classes.root}>
            <AppBar>
                <Toolbar className={classes.toolbar}>
                    <Hamburger />
                    <Typography variant="h6" className={classes.title}>
                        <Link
                            onClick={closeToggle}
                            className="nav-link"
                            style={{ display: "inline" }}
                            to="/">
                            RB
                        </Link>
                    </Typography>

                    {
                        (publicID)
                            ? <ProfileDropdown />
                            : <Link
                                onClick={closeToggle}
                                className="nav-link"
                                style={{ display: "inline", padding: "0", textDecoration: "none" }}
                                to="/signin">
                                <Button color="inherit">Login</Button>
                            </Link>
                    }

                </Toolbar>
            </AppBar>
        </div>
    );
}

export default TopNavbar;