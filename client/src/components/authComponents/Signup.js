import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    Button, Form, FormGroup, Input, Container, Alert, Row, Col,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import { userSigned } from '../../actions';
import { SERVERURL } from '../../constants';


class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: '',
            errorMessage: '',
            modal: false,
            accessCode: '',
            blockUnmounting: false
        };
        this.signUp = this.signUp.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.toggle = this.toggle.bind(this);
        this.varifyEmail = this.varifyEmail.bind(this);
        this.resendVerifyEmail = this.resendVerifyEmail.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    varifyEmail() {
        this.setState({ blockUnmounting: true });
        const { email, accessCode } = this.state;
        axios.post(SERVERURL + 'auth/verifymail', { email, accessCode })
            .then((response) => {

                if (response.status === 200) {
                    localStorage.reactBoardToken = response.data.token;
                    this.props.userSigned(true);
                    this.props.history.replace('./')
                }
            })
            .catch((error) => {
                if (error.response.data.error.includes("accessCode"))
                    return this.setState({ errorMessage: "verification code length must be 5 characters long" });
                this.setState({ errorMessage: error.response.data.error/*, modal: false*/, blockUnmounting: false });
            });


        //  ovde mora jos jedan axios pa u response da doleti token

    }
    resendVerifyEmail() {
        this.setState({ blockUnmounting: true });
        const { email } = this.state;
        axios.post(SERVERURL + 'auth/resend-verification-mail', { email })
            .then((response) => {
                this.setState({ blockUnmounting: false });
                
            })
            .catch((error) => {

                this.setState({ errorMessage: error.response.data.error/*, modal: false*/, blockUnmounting: false });
            });
        }

    signUp() {
        this.setState({ blockUnmounting: true });
        const { email, password, name } = this.state;
        axios.post(SERVERURL + 'auth/signup', { email, password, name })
            .then((response) => {

                if (response.status === 204) {

                    this.setState({
                        modal: true,
                        blockUnmounting: false
                    });
                }
            })
            .catch((error) => {
                this.setState({ errorMessage: error.response.data.error, blockUnmounting: false });
            });



    }
    handleKeyPress(e) {
        if (e.key === 'Enter') this.signUp();

    }

    handleChange(e) {
        this.setState({ errorMessage: '', [e.target.name]: e.target.value });
    }
  

    render() {
        let errorMessage = (this.state.errorMessage !== '') ? <Alert color="warning opacity-5">{this.state.errorMessage}</Alert> : null;
        return (
            <div>
                <Container>
                    <Row>
                        <Col lg="3" md="2" sm="1" xs="12"></Col>
                        <Col lg="6" md="8" sm="10" xs="12">
                            <Form className="form-boxshadow p-3 rounded">
                                <h3 className="text-light text-center font-flower"> SIGN UP </h3>
                                <FormGroup> <Input type="email" placeholder="email" name="email" onChange={this.handleChange} onKeyPress={this.handleKeyPress} /> </FormGroup>
                                <FormGroup> <Input type="text" placeholder="name" name="name" onChange={this.handleChange} onKeyPress={this.handleKeyPress} /> </FormGroup>
                                <FormGroup> <Input type="password" placeholder="password" name="password" onChange={this.handleChange} onKeyPress={this.handleKeyPress} /> </FormGroup>
                                <FormGroup> <Button color="primary" type="button" onClick={this.signUp}> Sign Up </Button> </FormGroup>
                                <FormGroup>
                                   { (!this.state.blockUnmounting) ?
                                        <Link className="text-light font-flower" style={{ textDecoration: 'none' }} to={'./signin'}>
                                            Already a user? Sign in instead
                                        </Link> : null
                                    }
                                </FormGroup>
                                <FormGroup> {errorMessage} </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                </Container>
                <div>

                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                        <ModalHeader toggle={this.toggle}>Verify Email</ModalHeader>
                        <ModalBody>
                            For your security, we want to make sure it's really you. We will send an email
                            with a 5-digit verification code.
                            Please, enter the verification code.
                            <div> <Input type="text" placeholder="verification code" name="accessCode" onChange={this.handleChange} /> </div>

                            <div className="mt-1"> {errorMessage} </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.varifyEmail}>Verify</Button>{' '}
                            <Button color="secondary" onClick={this.resendVerifyEmail}>Resend email</Button>

                        </ModalFooter>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default connect(null, { userSigned })(Signup);