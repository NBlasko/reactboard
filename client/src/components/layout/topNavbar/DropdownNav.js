import React from 'react';
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import { withRouter } from "react-router";

function DropdownNav(props) {

    const NavigateProgrammatically = (e) => {
        const { history } = props;
        const { pathname } = history.location;
        if (
            !(pathname + "newblogs" === "/" + e.target.name) &&
            !(pathname === "/" + e.target.name)
        ) {
            if (e.target.name === "newblogs")
                history.replace('/');
            else
                history.replace('/' + e.target.name);
        }
        props.closeToggle();
    }

    return (
        <UncontrolledDropdown nav inNavbar >

            <DropdownToggle
                nav
                caret
                className="text-dark tab"
            >
                Home
            </DropdownToggle>

            <DropdownMenu right>
                <DropdownItem
                    name="newblogs"
                    onClick={NavigateProgrammatically}
                >
                    New blogs
                </DropdownItem>

                <DropdownItem
                    name="mostseenblogs"
                    onClick={NavigateProgrammatically}
                >
                    Most seen blogs
                </DropdownItem>

                <DropdownItem
                    name="mostlikedblogs"
                    onClick={NavigateProgrammatically}
                >
                    Most liked blogs
                </DropdownItem>

            </DropdownMenu>
        </UncontrolledDropdown>
    )
}



const DropdownNavWithRouter = withRouter(DropdownNav);

export default DropdownNavWithRouter;