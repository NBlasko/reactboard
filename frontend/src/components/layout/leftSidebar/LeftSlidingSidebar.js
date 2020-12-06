import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { toggleLeftSidebarAction } from '../../../store/actions/toggle'
import { useSelector, useDispatch } from 'react-redux';

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    // fullList: {
    //     width: 'auto',
    // },
});

export default function LeftSlidingSidebar() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const isDrawerOpen = useSelector(state => state.toggle.isDrawerOpen);
    const toggleDrawer = (value) => (event) => {
        if (event
            && event.type === 'keydown'
            && (event.key === 'Tab' || event.key === 'Shift')
        ) return;
        dispatch(toggleLeftSidebarAction(value))
    };

    const list = () => (
        <div
            className={clsx(classes.list)}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>{
                            index % 2 === 0
                                ? <InboxIcon />
                                : <MailIcon />
                        }</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>{
                            index % 2 === 0
                                ? <InboxIcon />
                                : <MailIcon />
                        }</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <div>
                <SwipeableDrawer
                    anchor='left'
                    open={isDrawerOpen}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                >
                    {list('left')}
                </SwipeableDrawer>
        </div>
    );
}