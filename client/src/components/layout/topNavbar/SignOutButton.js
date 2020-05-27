import React from 'react';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';

function SignOutButton() {

    const SignOut = () => {
        localStorage.removeItem('reactBoardToken');
        window.location.reload();
    }

    return (
        <MenuItem onClick={SignOut}>
            <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
            >
            <ExitToAppIcon />
            </IconButton>
                Sign Out
        </MenuItem>
    )
}

export default SignOutButton;