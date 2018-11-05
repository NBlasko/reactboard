import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, FormGroup, Input, Container, Alert, Row, Col } from 'reactstrap';
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
            errorMessage: ''
        }
        this.signIn = this.signIn.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleGoogleOuth = this.handleGoogleOuth.bind(this);
        this.handleFacebookOuth = this.handleFacebookOuth.bind(this)

    }

    signIn() {

        let { email, password } = this.state;
        axios.post(SERVERURL + 'auth/signin', { email, password })
            .then((response) => {

                if (response.status === 200) {
                    localStorage.reactBoardToken = response.data.token;
                    this.props.userSigned(true);
                    this.props.history.replace('./');
                }
            })
            .catch((error) => {

                if (error.response.data === 'Unauthorized')
                    this.setState({ errorMessage: 'password and username do not match' });
                else
                    this.setState({ errorMessage: error.response.data.error });
            });
    }

    handleChange(e) {
        this.setState({ errorMessage: '', [e.target.name]: e.target.value })
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') this.signIn();
    }


    handleFacebookOuth(res) {
        axios.post(SERVERURL + 'auth/facebook', { access_token: res.accessToken })
            .then((response) => {

                if (response.status === 200) {
                    localStorage.reactBoardToken = response.data.token;
                    this.props.userSigned(true);
                    this.props.history.replace('./');
                }
            })
            .catch((error) => {
                console.log("error in Facebook Auth", error)
            });
    }

    handleGoogleOuth(res) {
        console.log(res)
        axios.post(SERVERURL + 'auth/google', { access_token: res.accessToken })
            .then((response) => {

                if (response.status === 200) {
                    localStorage.reactBoardToken = response.data.token;
                    this.props.userSigned(true);
                    this.props.history.replace('./');
                }
            })
            .catch((error) => {
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
                                <FormGroup> <Link className="text-light font-flower" style={{ textDecoration: 'none' }} to={'./signup'}> Sign up instead </Link> </FormGroup>
                                <FormGroup> {errorMessage} </FormGroup>
                            </Form>
                        </Col>

                    </Row>

                </Container>
            </div >
        );
    }
}



export default connect(null, { userSigned })(Signin);