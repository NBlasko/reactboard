import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, FormGroup, Container, Alert, Row, Col } from "reactstrap";
import useInput from "../../utils/ui/input/useInput";
import { AuthService } from "../../../api";
import SocialLogin from "../../utils/authComponents/SocialLogin";
import useVerifyMailModal from "../../utils/authComponents/useVerifyMailModal";

function SignupView() {
  const handleKeyPress = e => {
    if (e.key === "Enter") signUp();
  };

  const signUp = () => {
    setBlockUnmounting(true);
    AuthService.signUp({
      data: { email, password, displayName },
      onSuccess: () => {
        setOpenModal(true);
      },
      onError: error => error,
      onFinally: () => setBlockUnmounting(false)
    });
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
  const [blockUnmounting, setBlockUnmounting] = useState(false);
  const [verifyMailModal, setOpenModal] = useVerifyMailModal({ setBlockUnmounting, email });
  
  return (
    <div>
      {verifyMailModal}
      <div className="signContainer"> </div>
      <SocialLogin setBlockUnmounting={setBlockUnmounting} />
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
    </div>
  );
}

export default SignupView;
