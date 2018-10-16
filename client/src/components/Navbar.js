import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { addUserProfile, removeUserProfile, deleteAllMessagesAction, userSigned } from '../actions';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
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
        const navBarContent = (this.props.name) ?  ///ovde je problem
            <div className="navbarCustom">
                <Navbar color="light" light expand="md">
                    <NavbarToggler onClick={this.toggle} />
                    <NavbarBrand>React Board</NavbarBrand>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <Link onClick={this.closeToggle} className=" navbar-brand" to={'/'}>{this.props.name} </Link>
                            </NavItem>
                            <NavItem>
                                <Input placeholder="search" />
                            </NavItem>
                            <NavItem>
                                <Link onClick={this.closeToggle} className="nav-link" to={'/addmessage'}> Add message </Link>
                            </NavItem>
                            <NavItem>
                                <Link onClick={this.closeToggle} className="nav-link" to={'/profile'}> Profile </Link>
                            </NavItem>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret> Options </DropdownToggle>
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
