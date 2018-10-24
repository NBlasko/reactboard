import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { addUserProfile, removeUserProfile, deleteAllMessagesAction, userSigned } from '../actions';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Input
}
    from 'reactstrap';







class NavbarComponent extends Component {
    constructor(props) {
        super(props);
        this.SignOut = this.SignOut.bind(this);
        this.toggle = this.toggle.bind(this);
        this.closeToggle = this.closeToggle.bind(this);
        this.state = {
            isOpen: false
        };
    }
    componentDidMount() {
        if (localStorage.reactBoardToken) {
            this.props.addUserProfile();
        }
    }


    componentDidUpdate() {
        if (!this.props.name && localStorage.reactBoardToken) {
            this.props.addUserProfile();
            console.log("obnovljen uslovni update")
        }
    }
    SignOut() {
        localStorage.removeItem('reactBoardToken');
        this.props.removeUserProfile(); //all reducers should be here
        this.props.deleteAllMessagesAction();
        this.props.userSigned(false);
        this.props.history.replace('./signin');
    }


    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    closeToggle() {
        this.setState({
            isOpen: false
        });
    }

    render() {
        var name = this.props.name;

        let initials;
        if (name) {initials = name.match(/\b\w/g) || [];
        initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();}
        const navBarContent = (this.props.name) ?  ///ovde je problem
            <div className="navbarCustom small shadow">
                <Navbar color="light" light expand="sm">
                    <NavbarToggler onClick={this.toggle} />
                    <span className="text-dark h4 logoCustom"  >RB</span>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <Input className="float-right" placeholder="search" />
                            </NavItem>
                            <NavItem className="d-none d-sm-block">
                                <Link onClick={this.closeToggle} className="nav-link h6 text-light customCircle" to={'/'}>{initials}</Link>
                            </NavItem>
                            <NavItem className="d-block d-sm-none">
                                <Link onClick={this.closeToggle} className="nav-link text-dark" to={'/'}>{name}</Link>
                            </NavItem>
                            <NavItem>
                                <Link onClick={this.closeToggle} className="nav-link text-dark tab" to={'/addmessage'}> Add message </Link>
                            </NavItem>
                            <NavItem>
                                <Link onClick={this.closeToggle} className="nav-link text-dark tab" to={'/profile'}> Profile </Link>
                            </NavItem>
                            <UncontrolledDropdown nav inNavbar >
                                <DropdownToggle nav caret className="text-dark tab"> Options </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem onClick={this.closeToggle}> Option 1 </DropdownItem>
                                    <DropdownItem onClick={this.closeToggle}> Option 2 </DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem onClick={this.SignOut}> SignOut </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                    </Collapse>
                </Navbar>




            </div> : null;
        return (
            <div>
                {navBarContent}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        name: state.user.name,
        PublicID: state.user.PublicID,
        signed: state.userSignedBool.signed
    }
}


export default connect(mapStateToProps, { addUserProfile, removeUserProfile, deleteAllMessagesAction, userSigned })(NavbarComponent);
