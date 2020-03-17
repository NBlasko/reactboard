import React from 'react';
import { NavItem } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { removeUserProfile, } from '../../../store/actions';
import { withRouter } from "react-router";

function SignOutButton(props) {

    const dispatch = useDispatch();

    const SignOut = (e) => {
        localStorage.removeItem('reactBoardToken');
        dispatch(removeUserProfile()); //all reducers should be here
        props.history.replace('/signin');
    }

    return (
        <NavItem>
            <span
                onClick={SignOut}
                className="signoutReactBoard nav-link text-dark tab"
            >
                SignOut
        </span>
        </NavItem>
    )

}

const SignOutButtonWithRouter = withRouter(SignOutButton);


export default SignOutButtonWithRouter;