import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, FormGroup, Input, Container, Alert } from 'reactstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import { userSigned } from '../../actions';
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
    }

    signIn() {

        let { email, password } = this.state;
        axios.post('http://localhost:3001/auth/signin', { email, password })
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

    render() {
        let errorMessage = (this.state.errorMessage !== '') ? <Alert color="warning">{this.state.errorMessage}</Alert> : null;
        return (
            <div>
                <Container>
                    <Form>
                        <h3> SIGN IN </h3>
                        <FormGroup> <Input type="email" placeholder="email" name="email" onChange={this.handleChange} onKeyPress={this.handleKeyPress} /> </FormGroup>
                        <FormGroup> <Input type="password" placeholder="password" name="password" onChange={this.handleChange} onKeyPress={this.handleKeyPress} /> </FormGroup>
                        <FormGroup> <Button color="primary" className="rigthAlign" type="button" onClick={this.signIn}> Sign In </Button> </FormGroup>
                        <FormGroup> <Link to={'./signup'}> Sign up instead </Link> </FormGroup>
                        <FormGroup> {errorMessage} </FormGroup>
                    </Form>
                </Container>
            </div>
        );
    }
}



export default connect(null, { userSigned })(Signin);