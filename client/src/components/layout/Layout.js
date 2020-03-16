import React from 'react';
import MainContent from './MainContent';
import TopNavbar from './TopNavbar';
import { BrowserRouter as Router, Route} from 'react-router-dom';

function Layout() {
    return (
        <Router path="/" >
            <Route component={TopNavbar} />
            <MainContent />
        </Router>
    );
}

export default Layout;