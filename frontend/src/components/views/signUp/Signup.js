import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, FormGroup, Container, Alert, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
import { connect } from "react-redux";
import { userSigned } from "../../../store/actions";
import { SERVER_BASE_URL } from "../../../store/types/types";
import useInput from "../../utils/ui/input/useInput";

function SignupView(props) {
  const handleKeyPress = e => {
    if (e.key === "Enter") signUp();
  };

  const verifyEmail = () => {
    setBlockUnmounting(true);
    axios
      .post(SERVER_BASE_URL + "api/auth/verify-mail", { email, accessCode })
      .then(response => {
        if (response.status === 200) {
          localStorage.reactBoardToken = response.data.token;
          props.userSigned(true);
          props.history.replace("./");
        }
      })
      .catch(error => {
        if (error.response.data.error.includes("accessCode")) {
          setErrorMessage("verification code length must be 5 characters long");
        } else {
          setErrorMessage(error.response.data.error);
        }
        setBlockUnmounting(false);
      });
  };

  const resendVerifyEmail = () => {
    setBlockUnmounting(true);
    const { email } = this.state;
    axios
      .post(SERVER_BASE_URL + "api/auth/resend-verification-mail", { email })
      .then(response => {
        console.log("Email is sent");
      })
      .catch(error => setErrorMessage(error.response.data.error))
      .finally(() => setBlockUnmounting(false));
  };

  const signUp = () => {
    setBlockUnmounting(true);

    axios
      .post(SERVER_BASE_URL + "api/auth/signup", { email, password, displayName })
      .then(response => setIsModalOpen(true))
      .catch(error => setErrorMessage(error.message)) //potrebno je hendlati na backu ovo
      .finally(() => setBlockUnmounting(false));
  };

  const [errorMessage, setErrorMessage] = useState("");
  const [email, emailInput] = useInput({ label: "Enter email", handleKeyPress, onUpdate: () => setErrorMessage("") });
  const [password, passwordInput] = useInput({
    type: "password",
    label: "Enter password",
    handleKeyPress,
    onUpdate: () => setErrorMessage("")
  });
  const [displayName, displayNameInput] = useInput({ label: "Enter name", handleKeyPress, onUpdate: () => setErrorMessage("") });
  const [accessCode, accessCodeInput] = useInput({ label: "verification code" });

  const [blockUnmounting, setBlockUnmounting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  console.log("errorMessage", errorMessage);
  return (
    <div>
      <div className="signContainer"> </div>
      <Container>
        <Row>
          <Col lg="3" md="2" sm="1" xs="12"></Col>
          <Col lg="6" md="8" sm="10" xs="12">
            <Form className="form-boxshadow p-3 rounded">
              <h3 className="text-light text-center font-flower"> SIGN UP </h3>
              <FormGroup> {emailInput}</FormGroup>
              <FormGroup> {displayNameInput} </FormGroup>
              <FormGroup> {passwordInput} </FormGroup>
              <FormGroup>
                {" "}
                <Button color="primary" type="button" onClick={signUp}>
                  {" "}
                  Sign Up{" "}
                </Button>{" "}
              </FormGroup>
              <FormGroup>
                {!blockUnmounting ? (
                  <Link className="text-light font-flower" style={{ textDecoration: "none" }} to={"/signin"}>
                    Already a user? Sign in instead
                  </Link>
                ) : null}
              </FormGroup>
              <FormGroup> {errorMessage && <Alert color="warning opacity-5">{errorMessage}</Alert>} </FormGroup>
            </Form>
          </Col>
        </Row>
      </Container>
      <div>
        <Modal isOpen={isModalOpen} toggle={toggleModal} className={props.className}>
          <ModalHeader toggle={toggleModal}>Verify Email</ModalHeader>
          <ModalBody>
            For your security, we want to make sure it's really you. We will send an email with a 5-digit verification code. Please, enter
            the verification code.
            <div> {accessCodeInput} </div>
            <div className="mt-1"> {errorMessage} </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={verifyEmail}>
              Verify
            </Button>{" "}
            <Button color="secondary" onClick={resendVerifyEmail}>
              Resend email
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}

export default connect(null, { userSigned })(SignupView);
