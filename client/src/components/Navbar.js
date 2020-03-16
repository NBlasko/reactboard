import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Navbar.css';
import '../index.css';
import {
    addUserProfile,
    removeUserProfile,
    searchBlogsAction,
    searchProfilesAction
} from '../store/actions';
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
import search from '../assets/search.svg'




const logoFont = { fontFamily: "Italianno, cursive" }


class NavbarComponent extends Component {
    constructor(props) {
        super(props);
        this.SignOut = this.SignOut.bind(this);
        this.toggle = this.toggle.bind(this);
        this.closeToggle = this.closeToggle.bind(this);
        this.NavigateProgrammatically = this.NavigateProgrammatically.bind(this)
        this.handleDropDown = this.handleDropDown.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.sendSearch = this.sendSearch.bind(this);
        this.toggleInput = this.toggleInput.bind(this);
        this.closeToggleInput = this.closeToggleInput.bind(this);
        this.state = {
            isOpen: false,
            isOpeninput: false,
            dropInputClassBlog: "active",
            dropInputClassProfile: "",
            dropInputSelected: "blogs",
            searchText: ""
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
            //    console.log("obnovljen uslovni update")
        }
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.sendSearch();
            this.closeToggleInput()
        }
    }
    handleChange(e) {
        this.setState({ searchText: e.target.value })
    }

    sendSearch() {
        if (this.state.searchText !== "") {
            if (this.state.dropInputSelected === "profiles") {
                this.props.searchProfilesAction(this.state.searchText) //za sad radimo za blogove, kasnije za profile
                this.props.history.replace('/listsearchedprofiles');
            }
            else {
                this.props.searchBlogsAction(this.state.searchText) //za sad radimo za blogove, kasnije za profile
                this.props.history.replace('/searchedmessages');
            }
            this.closeToggle();
        }
    }

    handleDropDown(e) {
        if (e.target.name === "profiles")
            this.setState({ dropInputClassBlog: "", dropInputClassProfile: "active", dropInputSelected: "profiles" })
        else
            this.setState({ dropInputClassBlog: "active", dropInputClassProfile: "", dropInputSelected: "blogs" })
    }
    SignOut() {
        localStorage.removeItem('reactBoardToken');
        this.props.removeUserProfile(); //all reducers should be here
        this.props.history.replace('/signin');
    }

    NavigateProgrammatically(e) {
        if (
            !(this.props.history.location.pathname + "newblogs" === "/" + e.target.name) &&
            !(this.props.history.location.pathname === "/" + e.target.name)
        ) {
            if (e.target.name === "newblogs")
                this.props.history.replace('/');
            else
                this.props.history.replace('/' + e.target.name);

        }
        this.closeToggle();
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }
    toggleInput() {
        this.setState({
            isOpeninput: !this.state.isOpeninput
        });
    }
    closeToggleInput() {
        this.setState({
            isOpeninput: false
        });
    }


    closeToggle() {
        this.setState({
            isOpen: false
        });
    }

    render() {

        const { publicID, name } = this.props;
        //   console.log("state", this.state)
        let initials;
        if (name) {
            initials = name.match(/\b\w/g) || [];
            initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
        }
        const navBarContent = (this.props.name) ?  ///ovde je problem
            <div className="navbarCustom small shadow">
                <Navbar color="light" light expand="sm">
                    <NavbarToggler onClick={this.toggle} />
                    <span className="text-dark h4" style={logoFont}>RB</span>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>


                            <UncontrolledDropdown isOpen={this.state.isOpeninput} toggle={this.toggleInput} className="float-right" style={{ margin: "0px" }} >
                                <DropdownToggle className="text-dark tab" style={{ margin: "0px", padding: "0px" }}>
                                    <Input className="float-right" placeholder={"search for " + this.state.dropInputSelected} style={{ margin: "0px" }} onKeyPress={this.handleKeyPress} onChange={this.handleChange} />
                                </DropdownToggle>

                                <DropdownMenu right>
                                    <DropdownItem onClick={this.handleDropDown} name="blogs">  Blogs {(this.state.dropInputClassBlog) ? <i className="fa fa-check"></i> : null} </DropdownItem>
                                    <DropdownItem name="profiles" onClick={this.handleDropDown} > Profiles {(this.state.dropInputClassProfile) ? <i className="fa fa-check"></i> : null} </DropdownItem>
                                    <DropdownItem name="searchGo" onClick={this.sendSearch} className="btn-dark" > Start search <img style={{ height: "20px" }} src={search} alt="search" /> </DropdownItem>

                                </DropdownMenu>
                            </UncontrolledDropdown>

                            <NavItem className="d-none d-sm-block">
                                <Link onClick={this.closeToggle} className="nav-link h6 text-light customCircle" to={`/singleprofile/${publicID}`}>{initials}</Link>
                            </NavItem>
                            <NavItem className="d-block d-sm-none">
                                <Link onClick={this.closeToggle} className="nav-link text-dark" to={`/singleprofile/${publicID}`}>{name}</Link>
                            </NavItem>
                            <NavItem>
                                <Link onClick={this.closeToggle} className="nav-link text-dark tab" to={'/addmessage'}> Add message </Link>
                            </NavItem>
                            <UncontrolledDropdown nav inNavbar >
                                <DropdownToggle nav caret className="text-dark tab"> Home </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem name="newblogs" onClick={this.NavigateProgrammatically}>  New blogs </DropdownItem>
                                    <DropdownItem name="mostseenblogs" onClick={this.NavigateProgrammatically}> Most seen blogs </DropdownItem>
                                    <DropdownItem name="mostlikedblogs" onClick={this.NavigateProgrammatically}> Most liked blogs </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                            <NavItem>
                                <span onClick={this.SignOut} className="signoutReactBoard nav-link text-dark tab"> SignOut  </span>
                            </NavItem>
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
        publicID: state.user.publicID,
        signed: state.userSignedBool.signed
    }
}


export default connect(mapStateToProps, { addUserProfile, removeUserProfile, searchBlogsAction, searchProfilesAction })(NavbarComponent);
