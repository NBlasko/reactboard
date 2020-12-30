import React from "react";
import { connect } from "react-redux";
import { userSigned } from "../../../store/actions";
import iconFacebook from "../../../assets/facebook.svg";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import { useHistory } from "react-router-dom";
//import { useStyles } from "./SignIn.style";
import { AuthService } from "../../../api";
import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
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
    width: "100%"
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

function SocialLogin({ setBlockUnmounting, userSigned }) {
  const classes = useStyles();
  const history = useHistory();
  
  const handleFacebookOuth = res => {
    setBlockUnmounting(true);
    AuthService.facebookOAuth({
      data: { access_token: res.accessToken },
      onSuccess: response => {
        localStorage.reactBoardToken = response.token;
        userSigned(true);
        history.replace("./");
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
        userSigned(true);
        history.replace("./");
      },
      onError: error => {
        setBlockUnmounting(false);
        return error;
      }
    });
  };

  return (
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
        className={classes.socialBtn + " " + classes.google}
      >
        Google
      </GoogleLogin>
    </div>
  );
}

export default connect(null, { userSigned })(SocialLogin);
