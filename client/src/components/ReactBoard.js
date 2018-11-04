import React, { Component } from 'react';

import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

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
                        <div className={(!localStorage.reactBoardToken) ? "signContainer" : null} style={{ paddingTop: "55px" }}>
                            <Switch>
                                <Route exact path="/" render={(props) => (
                                    !localStorage.reactBoardToken ?
                                        (<Redirect to="/signin" replace />) : (<ListMessages {...props} />))} />

                                <Route exact path="/mostseenblogs" render={(props) => (
                                    !localStorage.reactBoardToken ?
                                        (<Redirect to="/signin" replace />) : (<ListMessages  {...props}  />))} />

                                <Route exact path="/mostlikedblogs" render={(props) => (
                                    !localStorage.reactBoardToken ?
                                        (<Redirect to="/signin" replace />) : (<ListMessages  {...props}  />))} />

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
const mapStateToProps = (state) => {
    return {
        name: state.user.name   //the only for this prop here is to activate lifecycle to rerender this component
    }
}


export default connect(mapStateToProps, null)(ReactBoard);
