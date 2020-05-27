import React, { Fragment } from 'react';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SignOutButton from './SignOutButton';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProfileDropdown({ history }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const publicID = useSelector(state => state.user.publicID);
    const userName = useSelector(state => state.user.name);

    const gotToMyProfile = () => {
        history.push(`/singleprofile/${publicID}`);
        setAnchorEl(null);
    }
    
    return (
        <Fragment>
            <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
            >
                <AccountCircle />
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
            >

                <MenuItem onClick={gotToMyProfile}>
                    {userName}
                </MenuItem>

                <MenuItem onClick={gotToMyProfile} >
                    <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <SettingsIcon />
                    </IconButton>
                    Profile Settings
                 </MenuItem>
                <SignOutButton />
            </Menu>
        </Fragment>
    );
}

const ProfileDropdownWithRouter = withRouter(ProfileDropdown)
export default ProfileDropdownWithRouter;