import React from 'react';

import { Route, Redirect, Switch } from 'react-router-dom';
import ListMessages from '../views/listMessages/ListMessages';
import SignIn from '../views/signIn/SignIn';
import SignUp from '../views/signUp/Signup';
import AddMessage from '../views/addMessage/AddMessage';
import SingleBlog from '../views/singleBlog/SingleBlog';
import SingleProfile from '../views/singleProfile/SingleProfile';
import ListSearchedProfiles from '../views/listSearchedProfiles/ListSearchedProfiles';
import ListSearchedMessages from '../views/listSearchedMessages/ListSearchedMessages';



function customRender({ RedirectComponent, props }) {
    return (
        !localStorage.reactBoardToken
            ? (<Redirect to="/signin" replace />)
            : (<RedirectComponent {...props} />)
    )
}


function MainContent() {
    return (

        <div style={{ paddingTop: "55px", margin: "auto", maxWidth: "650px" }}>
            <Switch>

                <Route exact path="/" render={(props) =>
                    customRender({ RedirectComponent: ListMessages, props })
                } />

                <Route exact path="/mostseenblogs" render={(props) =>
                    customRender({ RedirectComponent: ListMessages, props })
                } />

                <Route exact path="/mostlikedblogs" render={(props) =>
                    customRender({ RedirectComponent: ListMessages, props })
                } />

                <Route exact path="/addmessage" render={(props) =>
                    customRender({ RedirectComponent: AddMessage, props })
                } />

                <Route exact path="/searchedmessages" render={(props) =>
                    customRender({ RedirectComponent: ListSearchedMessages, props })
                } />

                <Route exact path="/listsearchedprofiles" render={(props) =>
                    customRender({ RedirectComponent: ListSearchedProfiles, props })
                } />

                <Route exact path="/singleprofile/:id" render={(props) =>
                    customRender({ RedirectComponent: SingleProfile, props })
                } />

                <Route exact path="/blog/:id" render={(props) =>
                    customRender({ RedirectComponent: SingleBlog, props })
                } />


                <Route exact path="/signin"
                    render={({ history }) => (
                        localStorage.reactBoardToken
                            ? (<Redirect to="/" replace />)
                            : (<SignIn history={history} />))
                    }
                />

                <Route exact path="/signup"
                    render={({ history }) => (
                        localStorage.reactBoardToken
                            ? (<Redirect to="/" replace />)
                            : (<SignUp history={history} />))
                    }
                />

                <Redirect from='*' to='/' />
            </Switch>
        </div>
    );
}

export default MainContent;