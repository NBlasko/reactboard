import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    Button, Form, FormGroup, Input, Container, Alert, Row, Col,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import { userSigned } from '../../actions';
import iconGoogle from '../../assets/google.svg';
import iconFacebook from '../../assets/facebook.svg';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { SERVERURL } from '../../constants'

class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMessage: '',
            blockUnmounting: false,
            modal: false
        }
        this.signIn = this.signIn.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleGoogleOuth = this.handleGoogleOuth.bind(this);
        this.handleFacebookOuth = this.handleFacebookOuth.bind(this);
        this.toggle = this.toggle.bind(this);
        this.verifyEmail = this.verifyEmail.bind(this);
        this.resendVerifyEmail = this.resendVerifyEmail.bind(this);
    }
    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }


    signIn() {
        this.setState({ blockUnmounting: true });
        let { email, password } = this.state;
        axios.post(SERVERURL + 'auth/signin', { email, password })
            .then((response) => {
                console.log("ressssss", response)
                if (response.status === 200) {
                    localStorage.reactBoardToken = response.data.token;
                    this.props.userSigned(true);
                    this.props.history.replace('./');
                }
            })
            .catch((error) => {
                this.setState({ blockUnmounting: false });
                console.log("error.respone", error.response)
                if (error.response.data === 'Unauthorized') {
                    this.setState({ errorMessage: 'password and username do not match' });
                    return;
                }
                if (error.response.data.error === 'email is not verified') {
                    this.setState({ errorMessage: error.response.data.error });
                    // odavde saljemo novi kod i otvaramo modal za verifikaciju maila 
                    this.resendVerifyEmail();
                    this.toggle();
                    return;
                }

                this.setState({ errorMessage: error.response.data.error });
            });
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

    verifyEmail() {
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
        }

        //  ovde mora jos jedan axios pa u response da doleti token

        handleChange(e) {
            this.setState({ errorMessage: '', [e.target.name]: e.target.value })
        }

      

        handleKeyPress(e) {
            if (e.key === 'Enter') this.signIn();
        }


        handleFacebookOuth(res) {
            this.setState({ blockUnmounting: true });
            axios.post(SERVERURL + 'auth/facebook', { access_token: res.accessToken })
                .then((response) => {

                    if (response.status === 200) {
                        localStorage.reactBoardToken = response.data.token;
                        this.props.userSigned(true);
                        this.props.history.replace('./');
                    }
                })
                .catch((error) => {
                    this.setState({ blockUnmounting: false });
                    console.log("error in Facebook Auth", error)
                });
        }

        handleGoogleOuth(res) {
            //   console.log(res)
            this.setState({ blockUnmounting: true });
            axios.post(SERVERURL + 'auth/google', { access_token: res.accessToken })
                .then((response) => {

                    if (response.status === 200) {
                        localStorage.reactBoardToken = response.data.token;
                        this.props.userSigned(true);
                        this.props.history.replace('./');
                    }
                })
                .catch((error) => {
                    this.setState({ blockUnmounting: false });
                    console.log("error in Google Auth", error)
                });

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
                                    <h3 className="text-light text-center font-flower"> SIGN IN WITH </h3>

                                    <FormGroup>
                                        <span className="hoverSocial">
                                            <FacebookLogin
                                                appId="2217486381803421"
                                                autoLoad={false}
                                                fields="name,email,picture"
                                                callback={this.handleFacebookOuth}
                                                cssClass=" social-link btn btn-social text-light facebook-btn"
                                                icon={<img src={iconFacebook} alt="FACEBOOK" />}
                                                textButton="Facebook"
                                            />
                                        </span>

                                        <span className="hoverSocial">
                                            <GoogleLogin
                                                clientId="96297730196-r8fgd3j43in9q8a4esbufqf6ual9pvnh.apps.googleusercontent.com"
                                                onSuccess={this.handleGoogleOuth}
                                                onFailure={this.handleGoogleOuth}
                                                className="social-link btn btn-social btn-light float-right"
                                            >
                                                <img src={iconGoogle} alt="GOOGLE" />Google
                                    </GoogleLogin>
                                        </span>


                                    </FormGroup>
                                    <FormGroup> <Input type="email" placeholder="email" name="email" onChange={this.handleChange} onKeyPress={this.handleKeyPress} /> </FormGroup>
                                    <FormGroup> <Input type="password" placeholder="password" name="password" onChange={this.handleChange} onKeyPress={this.handleKeyPress} /> </FormGroup>
                                    <FormGroup> <Button color="primary" className="rigthAlign" type="button" onClick={this.signIn}> Sign In </Button> </FormGroup>
                                    <FormGroup>
                                        {
                                            (!this.state.blockUnmounting) ?
                                                <Link className="text-light font-flower" style={{ textDecoration: 'none' }} to={'./signup'}>
                                                    Sign up instead
                                        </Link> : null
                                        }
                                    </FormGroup>
                                    <FormGroup> {errorMessage} </FormGroup>
                                </Form>
                            </Col>

                        </Row>

                    </Container>

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
                            <Button color="primary" onClick={this.verifyEmail}>Verify</Button>{' '}
                            <Button color="secondary" onClick={this.resendVerifyEmail}>Resend email</Button>

                        </ModalFooter>
                    </Modal>
                </div >
            );
        }
    }



    export default connect(null, { userSigned })(Signin);