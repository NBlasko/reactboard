import React from 'react';

import { Route, Redirect, Switch } from 'react-router-dom';
import ListMessages from '../messagesComponents/ListMessages';
import Signin from '../views/signIn/Signin';
import Signup from '../views/signUp/Signup';
import AddMessage from '../views/addMessage/AddMessage';

import SingleBlog from '../messagesComponents/SingleBlog';
import SingleProfile from '../views/singleProfile/SingleProfile';   //'../profileComponents/SingleProfile';
import ListSearchedProfiles from '../profileComponents/ListSearchedProfiles';

import ListSearchedMessages from '../messagesComponents/ListSearchedMessages';

function MainContent() {
    return (

            <div style={{ paddingTop: "55px" }}>
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
                            (<Redirect to="/signin" replace />) : (<AddMessage {...props} />))} />


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
    );
}

export default MainContent;