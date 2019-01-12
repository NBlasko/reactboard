import React, { Component } from 'react';

import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import ListMessages from './messagesComponents/ListMessages';
import Signin from './authComponents/Signin';
import Signup from './authComponents/Signup';
import AddMessage from './addMessage/AddMessage';
import SingleBlog from './messagesComponents/SingleBlog';
import SingleProfile from './profileComponents/SingleProfile';
import ListSearchedProfiles from './profileComponents/ListSearchedProfiles';

import NavbarComponent from './Navbar';
import ListSearchedMessages from './messagesComponents/ListSearchedMessages';



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
                                        (<Redirect to="/signin" replace />) : (<ListMessages  {...props} />))} />

                                <Route exact path="/mostlikedblogs" render={(props) => (
                                    !localStorage.reactBoardToken ?
                                        (<Redirect to="/signin" replace />) : (<ListMessages  {...props} />))} />

                                <Route exact path="/addmessage" render={(routeProps) => (
                                    !localStorage.reactBoardToken ?
                                        (<Redirect to="/signin" replace />) : (<AddMessage routeProps={routeProps} />))} />





                                <Route exact path="/searchedmessages" render={(routeProps) => (
                                    !localStorage.reactBoardToken ?
                                        (<Redirect to="/signin" replace />) : (<ListSearchedMessages location={routeProps.location} />))} />

                                <Route exact path="/listsearchedprofiles" render={(routeProps) => (
                                    !localStorage.reactBoardToken ?
                                        (<Redirect to="/signin" replace />) : (<ListSearchedProfiles location={routeProps.location} />))} />

                                <Route exact path="/singleprofile/:id" render={(routeProps) => (
                                    !localStorage.reactBoardToken ?
                                        (<Redirect to="/signin" replace />) : (<SingleProfile routeProps={routeProps} />))}
                                />
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
        publicID: state.user.publicID   //the only use of this prop here is to activate lifecycle to rerender this component
    }
}


export default connect(mapStateToProps, null)(ReactBoard);
