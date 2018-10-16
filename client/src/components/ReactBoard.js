import React, { Component } from 'react';

import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';


import ListMessages from './messagesComponents/ListMessages';
import Signin from './authComponents/Signin';
import Signup from './authComponents/Signup';
import AddMessage from './addMessage/AddMessage';
import SingleBlog from './messagesComponents/SingleBlog';
import Profile from './profileComponents/Profile';
import NavbarComponent from './Navbar';



class ReactBoard extends Component {




    render() {
        return (
            <div>
                <Router path="/" >
                    <div>
                        <Route component={NavbarComponent} />
                        <div style={{paddingTop : "55px"}}> 
                        <Switch>
                            <Route exact path="/" render={() => (
                                !localStorage.reactBoardToken ?
                                    (<Redirect to="/signin" replace />) : (<ListMessages />))} />
                            <Route exact path="/addmessage" render={() => (
                                !localStorage.reactBoardToken ?
                                    (<Redirect to="/signin" replace />) : (<AddMessage />))} />

                            <Route exact path="/profile" render={() => (
                                !localStorage.reactBoardToken ?
                                    (<Redirect to="/signin" replace />) : (<Profile />))} />

                            <Route exact path="/blog/:id" render={(routeProps) => (
                                !localStorage.reactBoardToken ?
                                    (<Redirect to="/signin" replace />) : (<SingleBlog routeProps={routeProps} />))}
                            />

                            <Route exact path="/signin" render={({ history }) => (
                                localStorage.reactBoardToken ?
                                    (<Redirect to="/" replace />) : (<Signin history={history} />))} />

                            <Route exact path="/signup" render={({ history }) => (
                                localStorage.reactBoardToken ?
                                    (<Redirect to="/" replace />) : (<Signup history={history} />))} />

                            <Redirect from='*' to='/' />
                        </Switch>
                        </div>
                    </div>
                </Router>
            </div>
        );
    }
}


export default ReactBoard;
