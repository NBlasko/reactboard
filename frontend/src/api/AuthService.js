import { baseHttp } from "./baseHttp";

export const AuthService = {
  verifyMail: ({ data, onSuccess, onError, onFinally }) => {
    baseHttp({
      method: "POST",
      url: "auth/verify-mail",
      data,
      isAuthorized: false,
      onSuccess,
      onError,
      onFinally
    });
  },

  resendVerificationMail: ({ data, onSuccess, onError, onFinally }) => {
    baseHttp({
      method: "POST",
      url: "auth/resend-verification-mail",
      data,
      isAuthorized: false,
      onSuccess,
      onError,
      onFinally
    });
  },

  signUp: ({ data, onSuccess, onError, onFinally }) => {
    baseHttp({
      method: "POST",
      url: "auth/signup",
      data,
      isAuthorized: false,
      onSuccess,
      onError,
      onFinally
    });
  },

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
};
