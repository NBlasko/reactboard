import { baseHttp } from "./baseHttp";
import { useSelector, useDispatch } from "react-redux";


export const AuthService = {
  //   verifyMail: (req, res) => {},
  //   resendVerificationMail: (req, res) => {},
  //   signUp: (req, res) => {},

  signIn: ({ data, onSuccess, onError, onFinally }) => {
    baseHttp({
      method: "POST",
      url: "auth/signin",
      data,
      isAuthorized: false,
      onSuccess,
      onError,
      onFinally
    });
  },

  googleOAuth: ({ data, onSuccess, onError, onFinally }) => {
    baseHttp({
      method: "POST",
      url: "auth/google",
      data,
      isAuthorized: false,
      onSuccess,
      onError,
      onFinally
    });
  },

  facebookOAuth: ({ data, onSuccess, onError, onFinally }) => {
    baseHttp({
      method: "POST",
      url: "auth/facebook",
      data,
      isAuthorized: false,
      onSuccess,
      onError,
      onFinally
    });
  }

  //   secret: (req, res) => {}
};
