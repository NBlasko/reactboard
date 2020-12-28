import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
import { connect } from "react-redux";
import { userSigned } from "../../../store/actions";
import iconFacebook from "../../../assets/facebook.svg";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import { SERVERURL } from "../../../store/types/types";
import useInput from "../../utils/ui/input/useInput";
import Grid from "@material-ui/core/Grid";
import { PrimaryButton } from "../../utils/ui/button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  socialBtnWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    "& span": {
      width: "100%"
    }
  },

  socialBtn: {
    marginBottom: "1rem",
    height: "3rem",
    cursor: "pointer",
    width: "100%",
 
  },
  facebook: {
    background: "rgb(59, 89, 152)",
    textAlign: "left",
    color: "#e5e5e5",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 2px 2px 0px, rgba(0, 0, 0, 0.24) 0px 0px 1px 0px",
    borderRadius: "2px",
    border: "1px solid transparent",
    fontSize: "14px",
    fontWeight: 500,
    fontFamily: "Roboto, sans-serif",
    "& img": {
      width: "18px",
      height: "18px",
      margin: "auto 22px auto 3px"
    },
    "&:hover": {
      background: "#4267b2"
    }
  },

  google: {
    "& span": {
      textAlign: "left"
    }
  }
});

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
      .post(SERVERURL + "api/auth/verify-mail", { email, accessCode })
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
      .post(SERVERURL + "api/auth/resend-verification-mail", { email })
      .then(response => {
        console.log("Email is sent");
      })
      .catch(error => setErrorMessage(error.response.data.error))
      .finally(() => setBlockUnmounting(false));
  };

  const handleFacebookOuth = res => {
    setBlockUnmounting(true);
    axios
      .post(SERVERURL + "api/auth/facebook", { access_token: res.accessToken })
      .then(response => {
        if (response.status === 200) {
          localStorage.reactBoardToken = response.data.token;
          props.userSigned(true);
          props.history.replace("./");
        }
      })
      .catch(error => {
        setBlockUnmounting(false);
        console.log("error in Facebook Auth", error);
      });
  };

  const handleGoogleOuth = res => {
    console.log("res", res);
    setBlockUnmounting(true);

    axios
      .post(SERVERURL + "api/auth/google", { access_token: res.accessToken })
      .then(response => {
        if (response.status === 200) {
          localStorage.reactBoardToken = response.data.token;
          props.userSigned(true);
          props.history.replace("./");
        }
      })
      .catch(error => {
        setBlockUnmounting(false);
        console.log("error in Google Auth", error);
      });
  };

  const signIn = () => {
    setBlockUnmounting(true);
    axios
      .post(SERVERURL + "api/auth/signin", { email, password })
      .then(response => {
        console.log("response", response);
        if (response.status === 200) {
          localStorage.reactBoardToken = response.data.token;
          props.userSigned(true);
          props.history.replace("./");
        }
      })
      .catch(error => {
        setBlockUnmounting(false);
        console.log("error.respone", error);
        if (error.response.data === "Unauthorized") {
          setErrorMessage("password and username do not match");
          return;
        }
        if (error.response.data.error === "email is not verified") {
          setErrorMessage(error.response.data.error);

          // odavde saljemo novi kod i otvaramo modal za verifikaciju maila
          resendVerifyEmail();
          toggleModal();
          return;
        }
        if (typeof error.response.data.error === "string") {
          setErrorMessage(error.response.data.error);
          return;
        }
        console.log("AAAAAAAA hendlaj gresku, tj. napravi da greske dolaze u istom formatu");
      });
  };

  return (
    <div>
      <div className="signContainer"> </div>
      <Grid container direction="row" justify="space-between">
        <Grid item xs={12} sm={2} md={2} lg={2}></Grid>
        <Grid item xs={12} sm={8} md={8} lg={8}>
          <div className="form-boxshadow p-3 rounded">
            <h3 className="text-light text-center font-flower"> SIGN IN WITH </h3>

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
                onFailure={handleGoogleOuth}
                className={classes.socialBtn + " " + classes.google}
              >
                {/* <img src={iconGoogle} alt="GOOGLE" /> */}
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
              </PrimaryButton>{" "}
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
