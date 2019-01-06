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
    import search from '../assets/search.svg'







class NavbarComponent extends Component {
    constructor(props) {
        super(props);
        this.SignOut = this.SignOut.bind(this);
        this.toggle = this.toggle.bind(this);
        this.closeToggle = this.closeToggle.bind(this);
        this.NavigateProgrammatically = this.NavigateProgrammatically.bind(this)
        this.handleDropDown = this.handleDropDown.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.state = {
            isOpen: false,
            dropInputClassBlog: "active", 
            dropInputClassProfile: "", 
            dropInputSelected: "blogs",
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

    handleKeyPress(e){
        console.log("handleKeyPress", e.key) //Za enter spremam
    }

    handleDropDown(e){
        if (e.target.name === "profiles")
           this.setState({ dropInputClassBlog: "", dropInputClassProfile: "active", dropInputSelected: "profiles"})
        else
        this.setState({ dropInputClassBlog: "active", dropInputClassProfile: "", dropInputSelected: "blogs"})
    }
    SignOut() {
        localStorage.removeItem('reactBoardToken');
        this.props.removeUserProfile(); //all reducers should be here
        this.props.deleteAllMessagesAction();
        this.props.userSigned(false);
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
            isOpen: !this.state.isOpen
        });
    }

    closeToggle() {
        this.setState({
            isOpen: false
        });
    }

    render() {

        const { publicID, name } = this.props;
             console.log("state", this.state)
        let initials;
        if (name) {
            initials = name.match(/\b\w/g) || [];
            initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
        }
        const navBarContent = (this.props.name) ?  ///ovde je problem
            <div className="navbarCustom small shadow">
                <Navbar color="light" light expand="sm">
                    <NavbarToggler onClick={this.toggle} />
                    <span className="text-dark h4 logoCustom"  >RB</span>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>


                            <UncontrolledDropdown  className="float-right"  style= {{margin : "0px"}} >
                                <DropdownToggle  className="text-dark tab" style= {{margin : "0px", padding : "0px"}}>
                                    <Input  className="float-right" placeholder={"search for " + this.state.dropInputSelected} style= {{margin : "0px"}} onKeyPress={this.handleKeyPress}  />
                                </DropdownToggle>
                                
                                <DropdownMenu right>
                                    <DropdownItem toggle={false} className = {this.state.dropInputClassBlog} onClick = {this.handleDropDown} name="blogs">  Blogs {(this.state.dropInputClassBlog)? <i className="fa fa-check"></i> : null} </DropdownItem>
                                    <DropdownItem toggle={false}  className = {this.state.dropInputClassProfile} name="profiles" onClick = {this.handleDropDown} > Profiles {(this.state.dropInputClassProfile)? <i className="fa fa-check"></i> : null} </DropdownItem>
                                    <DropdownItem name="searchGo" className = "btn-dark" > Start search <img style = {{height: "20px"}} src={search} alt= "search" /> </DropdownItem>
                               
                                </DropdownMenu>
                            </UncontrolledDropdown>
                           



                            <NavItem className="d-none d-sm-block">
                                <Link onClick={this.closeToggle} className="nav-link h6 text-light customCircle" to={`/singleprofile/${publicID}`}>{initials}</Link>
                            </NavItem>
                            <NavItem className="d-block d-sm-none">
                                <Link onClick={this.closeToggle} className="nav-link text-dark" to={'/'}>{name}</Link>
                            </NavItem>
                            <NavItem>
                                <Link onClick={this.closeToggle} className="nav-link text-dark tab" to={'/addmessage'}> + </Link>
                            </NavItem>
                            <NavItem>
                                <Link onClick={this.closeToggle} className="nav-link text-dark tab" to={'/listprofiles'}> Profiles </Link>
                            </NavItem>
                            <UncontrolledDropdown nav inNavbar >
                                <DropdownToggle nav caret className="text-dark tab"> Home </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem name="newblogs" onClick={this.NavigateProgrammatically}>  New blogs </DropdownItem>
                                    <DropdownItem name="mostseenblogs" onClick={this.NavigateProgrammatically}> Most seen blogs </DropdownItem>
                                    <DropdownItem name="mostlikedblogs" onClick={this.NavigateProgrammatically}> Most liked blogs </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
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
        publicID: state.user.publicID,
        signed: state.userSignedBool.signed
    }
}


export default connect(mapStateToProps, { addUserProfile, removeUserProfile, deleteAllMessagesAction, userSigned })(NavbarComponent);
