import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, FormGroup, Input, Container, Alert, Row, Col } from 'reactstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import { userSigned } from '../../actions';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: '',
            errorMessage: ''
        };
        this.signUp = this.signUp.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    signUp() {

        const { email, password, name } = this.state;
        axios.post('http://localhost:3001/auth/signup', { email, password, name })
            .then((response) => {

                if (response.status === 200) {
                    localStorage.reactBoardToken = response.data.token;
                    this.props.userSigned(true);
                    this.props.history.replace('./')
                }
            })
            .catch((error) => {
                this.setState({ errorMessage: error.response.data.error });
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
                                <h3  className="text-light text-center font-flower"> SIGN UP </h3>
                                <FormGroup> <Input type="email" placeholder="email" name="email" onChange={this.handleChange} onKeyPress={this.handleKeyPress} /> </FormGroup>
                                <FormGroup> <Input type="text" placeholder="name" name="name" onChange={this.handleChange} onKeyPress={this.handleKeyPress} /> </FormGroup>
                                <FormGroup> <Input type="password" placeholder="password" name="password" onChange={this.handleChange} onKeyPress={this.handleKeyPress} /> </FormGroup>
                                <FormGroup> <Button color="primary" type="button" onClick={this.signUp}> Sign Up </Button> </FormGroup>
                                <FormGroup> <Link className="text-light font-flower" style={{ textDecoration: 'none' }} to={'./signin'}> Already a user? Sign in instead </Link> </FormGroup>
                                <FormGroup> {errorMessage} </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                </Container>

            </div>
        );
    }
}

export default connect(null, { userSigned })(Signup);