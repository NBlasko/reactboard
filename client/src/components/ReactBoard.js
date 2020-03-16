import React, { Component } from 'react';

import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import ListMessages from './messagesComponents/ListMessages';
import Signin from './authComponents/Signin';
import Signup from './authComponents/Signup';
//import AddMessage from './addMessage/AddMessage';
import AddMessageHooks from './addMessage/AddMessageHooks';
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

                                <Route exact path="/addmessage" render={(props) => (
                                    !localStorage.reactBoardToken ?
                                        (<Redirect to="/signin" replace />) : (<AddMessageHooks {...props}  />))} />





                                <Route exact path="/searchedmessages" render={(props) => (
                                    !localStorage.reactBoardToken ?
                                        (<Redirect to="/signin" replace />) : (<ListSearchedMessages location={props.location} />))} />

                                <Route exact path="/listsearchedprofiles" render={(props) => (
                                    !localStorage.reactBoardToken ?
                                        (<Redirect to="/signin" replace />) : (<ListSearchedProfiles location={props.location} />))} />

                                <Route exact path="/singleprofile/:id" render={(props) => (
                                    !localStorage.reactBoardToken ?
                                        (<Redirect to="/signin" replace />) : (<SingleProfile {...props} />))}
                                />
                                <Route exact path="/blog/:id" render={(props) => (
                                    !localStorage.reactBoardToken ?
                                        (<Redirect to="/signin" replace />) : (<SingleBlog {...props} />))}
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
