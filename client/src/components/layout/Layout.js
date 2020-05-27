import React, { useState } from 'react';
import MainContent from './MainContent';
//import TopNavbar from './topNavbar/TopNavbar';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import TopNavbarMui from './topNavbar/TopNavbarMui';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LeftSlidingSidebar from './leftSidebar/LeftSlidingSidebar';
import LeftFixedSidebar from './leftSidebar/LeftFixedSidebar';


function Layout() {


    return (
        <Router path="/" >
            <Route
                render={() => (
                    <TopNavbarMui />
                )}
            />
            <LeftSlidingSidebar />

            <Grid
                container
                direction="row"
                justify="space-between"
            >
                <Hidden smDown>
                    <Grid item md={4} lg={3}>
                        <LeftFixedSidebar />
                    </Grid>
                </Hidden>

                <Grid item sm={12} md={8} lg={6}>
                    <MainContent />
                </Grid>

                <Hidden mdDown>
                    <Grid item lg={3}>
                        <div></div>
                    </Grid>
                </Hidden>
            </Grid>

        </Router>
    );
}

export default Layout;