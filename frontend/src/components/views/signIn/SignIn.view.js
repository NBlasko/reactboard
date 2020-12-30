import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { userSigned } from "../../../store/actions";
import useInput from "../../utils/ui/input/useInput";
import Grid from "@material-ui/core/Grid";
import { PrimaryButton } from "../../utils/ui/button";
import { AuthService } from "../../../api";
import SocialLogin from "../../utils/authComponents/SocialLogin";
import useVerifyMailModal from "../../utils/authComponents/useVerifyMailModal";

function SignIn(props) {

  const handleKeyPress = e => {
    if (e.key === "Enter") signIn();
  };

  const [email, emailInput] = useInput({ label: "Enter email", handleKeyPress });
  const [password, passwordInput] = useInput({ type: "password", label: "Enter password", handleKeyPress });
  const [blockUnmounting, setBlockUnmounting] = useState(false);
  const [verifyMailModal, setOpenModal] = useVerifyMailModal({ setBlockUnmounting, email });

  const resendVerifyEmail = () => {
    setBlockUnmounting(true);
    AuthService.resendVerificationMail({
      data: { email },
      onSuccess: () => {
        setOpenModal(true);
      },
      onError: error => error,
      onFinally: () => {
        setBlockUnmounting(false);
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
        if (error === "Email is not verified") {
          resendVerifyEmail();
        } else {
          return error;
        }
      }
    });
  };

  return (
    <div>
      {verifyMailModal}
      <Grid container direction="row" justify="space-between">
        <Grid item xs={12} sm={2} md={2} lg={2}></Grid>
        <Grid item xs={12} sm={8} md={8} lg={8}>
          <div>
            <h3> SIGN IN WITH </h3>

            <SocialLogin setBlockUnmounting={setBlockUnmounting} />
            <div> OR </div>
            <div> {emailInput}</div>
            <div> {passwordInput}</div>
            <div>
              <PrimaryButton color="primary" onClick={signIn}>
                Sign In
              </PrimaryButton>
            </div>

            <div>
              {!blockUnmounting ? (
                <Link className="text-light font-flower" style={{ textDecoration: "none" }} to={"/signup"}>
                  Sign up instead
                </Link>
              ) : null}
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={2} md={2} lg={2}></Grid>
      </Grid>
    </div>
  );
}

export default connect(null, { userSigned })(SignIn);
