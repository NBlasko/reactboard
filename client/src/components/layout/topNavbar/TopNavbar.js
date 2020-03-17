import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import '../../../css/Navbar.css';
import { addUserProfile } from '../../../store/actions';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem
}
    from 'reactstrap';

import SearchBar from './SearchBar';
import DropdownNav from './DropdownNav';
import SignOutButton from './SignOutButton';

const logoFont = { fontFamily: "Italianno, cursive" }


function TopNavbar(props) {

    let isSendFetchUser = useRef(false);
    const [isOpen, setIsOpen] = useState(false);

    const dispatch = useDispatch();
    const storeData = useSelector(state => {
        const { name, publicID } = state.user;
        return {
            name,
            publicID
        }
    });


    useEffect(() => {
        if (
            !storeData.publicID
            && localStorage.reactBoardToken
            && !isSendFetchUser.current
        ) {
            isSendFetchUser.current = true;
            dispatch(addUserProfile());
        }
    })


    useEffect(() => {
        if (storeData.publicID)
            isSendFetchUser.current = false;
    }, [storeData.publicID])

    const toggle = () => {
        setIsOpen(prevState => !prevState);
    }

    const closeToggle = () => {
        setIsOpen(false);
    }

    const { publicID, name } = storeData;
    let initials;

    if (name) {
        initials = name.match(/\b\w/g) || [];
        initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    }

    const navBarContent = (name)
        ? <div className="navbarCustom small shadow">
            <Navbar color="light" light expand="sm">
                <NavbarToggler onClick={toggle} />
                <span className="text-dark h4 customBrand" style={logoFont}>RB</span>
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ml-auto" navbar>

                        <SearchBar
                            closeToggle={closeToggle}
                        />

                        <NavItem className="d-none d-sm-block">
                            <Link
                                onClick={closeToggle}
                                className="nav-link h6 text-light customCircle"
                                to={`/singleprofile/${publicID}`}>
                                {initials}
                            </Link>
                        </NavItem>

                        <NavItem className="d-block d-sm-none">
                            <Link
                                onClick={closeToggle}
                                className="nav-link text-dark"
                                to={`/singleprofile/${publicID}`}>
                                {name}
                            </Link>
                        </NavItem>

                        <NavItem>
                            <Link
                                onClick={closeToggle}
                                className="nav-link text-dark tab"
                                to={'/addmessage'}>
                                Add
                            </Link>
                        </NavItem>

                        <DropdownNav
                            closeToggle={closeToggle}
                        />

                        <SignOutButton />
                    </Nav>

                </Collapse>
            </Navbar>
        </div>
        : null;

    return (
        <div>
            {navBarContent}
        </div>
    );
}

export default TopNavbar;