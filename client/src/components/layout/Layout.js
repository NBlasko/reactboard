import React from 'react';
import MainContent from './MainContent';
import TopNavbarHooks from './topNavbar/TopNavbar';
import { BrowserRouter as Router, Route} from 'react-router-dom';

function Layout() {
    return (
        <Router path="/" >
            <Route component={TopNavbarHooks} />
            <MainContent />
        </Router>
    );
}

export default Layout;