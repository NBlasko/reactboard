import React from "react";
import MainContent from "./MainContent";
//import TopNavbar from './topNavbar/TopNavbar';
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import TopNavbarMui from "./topNavbar/TopNavbarMui";
import { BrowserRouter as Router, Route } from "react-router-dom";
import LeftSlidingSidebar from "./leftSidebar/LeftSlidingSidebar";
import LeftFixedSidebar from "./leftSidebar/LeftFixedSidebar";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles({
  root: {
    backgroundColor: "lightgrey"
  }
});

function Layout() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ToastContainer />
      <Router path="/">
        <Route render={() => <TopNavbarMui />} />
        <LeftSlidingSidebar />

        <Grid container direction="row" justify="space-between">
          <Hidden smDown>
            <Grid item md={4} lg={3}>
              <LeftFixedSidebar />
            </Grid>
          </Hidden>

          <Grid item xs={12} sm={12} md={8} lg={6}>
            <MainContent />
          </Grid>

          <Hidden mdDown>
            <Grid item lg={3}>
              <div></div>
            </Grid>
          </Hidden>
        </Grid>
      </Router>
    </div>
  );
}

export default Layout;
