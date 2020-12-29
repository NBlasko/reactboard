import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
import { connect } from "react-redux";
import { userSigned } from "../../../store/actions";
import iconFacebook from "../../../assets/facebook.svg";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import { SERVER_BASE_URL } from "../../../store/types/types";
import useInput from "../../utils/ui/input/useInput";
import Grid from "@material-ui/core/Grid";
import { PrimaryButton } from "../../utils/ui/button";
import { useStyles } from "./SignIn.style";
import { AuthService } from "../../../api";

function SignIn(props) {
  const classes = useStyles();

  const handleKeyPress = e => {
    if (e.key === "Enter") signIn();
  };

  const [email, emailInput] = useInput({ label: "Enter email", handleKeyPress });
  const [password, passwordInput] = useInput({ type: "password", label: "Enter password", handleKeyPress });
  const [accessCode, accessCodeInput] = useInput({ label: "verification code" });

  const [blockUnmounting, setBlockUnmounting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

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

  const handleFacebookOuth = res => {
    setBlockUnmounting(true);
    AuthService.facebookOAuth({
      data: { access_token: res.accessToken },
      onSuccess: response => {
        localStorage.reactBoardToken = response.token;
        props.userSigned(true);
        props.history.replace("./");
      },
      onError: error => {
        setBlockUnmounting(false);
        return error;
      }
    });
  };

  const handleGoogleOuth = res => {
    setBlockUnmounting(true);
    AuthService.googleOAuth({
      data: { access_token: res.accessToken },
      onSuccess: response => {
        localStorage.reactBoardToken = response.token;
        props.userSigned(true);
        props.history.replace("./");
      },
      onError: error => {
        setBlockUnmounting(false);
        return error;
      }
    });
  };

  const signIn = () => {
    setBlockUnmounting(true);
    AuthService.signIn({
      data: { email, password },
      onSuccess: response => {
        localStorage.reactBoardToken = response.token;
        props.userSigned(true);
        props.history.replace("./");
      },
      onError: error => {
        setBlockUnmounting(false);
        console.log("error", error);
        if (error === "email is not verified") {
          resendVerifyEmail();
          toggleModal();
          return error;
        }
        return error;
      }
    });
  };

  return (
    <div>
      <Grid container direction="row" justify="space-between">
        <Grid item xs={12} sm={2} md={2} lg={2}></Grid>
        <Grid item xs={12} sm={8} md={8} lg={8}>
          <div>
            <h3> SIGN IN WITH </h3>

            <div className={classes.socialBtnWrapper}>
              <FacebookLogin
                appId={process.env.REACT_APP_FACEBOOK_CLIENT_ID}
                autoLoad={false}
                fields="name,email,picture"
                callback={handleFacebookOuth}
                cssClass={classes.socialBtn + " " + classes.facebook}
                icon={<img src={iconFacebook} alt="FACEBOOK" />}
                textButton="Facebook"
              />

              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                onSuccess={handleGoogleOuth}
                // onFailure={() => {}}
                className={classes.socialBtn + " " + classes.google}
              >
                Google
              </GoogleLogin>
            </div>
            <div> OR </div>
            <div> {emailInput}</div>
            <div> {passwordInput}</div>
            <div>
              <PrimaryButton color="primary" onClick={signIn}>
                {" "}
                Sign In{" "}
              </PrimaryButton>
            </div>

            <div>
              {!blockUnmounting ? (
                <Link className="text-light font-flower" style={{ textDecoration: "none" }} to={"/signup"}>
                  Sign up instead
                </Link>
              ) : null}
            </div>
            <div> {errorMessage} </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={2} md={2} lg={2}></Grid>
      </Grid>

      {
        <Modal isOpen={isModalOpen} toggle={toggleModal} className={props.className}>
          <ModalHeader toggle={toggleModal}>Verify Email</ModalHeader>
          <ModalBody>
            For your security, we want to make sure it's really you. We will send an email with a 5-digit verification code. Please, enter
            the verification code.
            <div> {accessCodeInput}</div>
            <div className="mt-1"> {errorMessage} </div>
          </ModalBody>
          <ModalFooter>
            <PrimaryButton color="primary" onClick={verifyEmail}>
              Verify
            </PrimaryButton>{" "}
            <PrimaryButton color="secondary" onClick={resendVerifyEmail}>
              Resend email
            </PrimaryButton>
          </ModalFooter>
        </Modal>
      }
    </div>
  );
}

export default connect(null, { userSigned })(SignIn);
