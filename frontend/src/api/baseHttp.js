import axios from "axios";
import { SERVER_BASE_URL } from "../store/types/types";
import { toast } from "react-toastify";

const HEADERS_AUTHORIZATION = `Bearer ${localStorage.reactBoardToken}`;
const cb = () => {};

/**
 * @param method: GET, POST, DELETE, PUT, PATCH
 * @param url: extension to base url
 * @param isAuthorized: will request send authorization credentials
 * @param params: query string params in request headers
 * @param data: extension to base url
 * @param onSuccess: success callback function
 * @param onError: error callback function
 * @param onFinally: function that fires after onSuccess or onError
 * */
export const baseHttp = ({
  method = "GET",
  url = "",
  isAuthorized = true,
  params = {},
  data = {},
  onSuccess = cb,
  onError = cb,
  onFinally = cb
}) => {
  const config = {
    method,
    url: `${SERVER_BASE_URL}/api/${url}`,
    headers: {},
    params,
    data
  };

  if (isAuthorized) {
    config.headers.Authorization = HEADERS_AUTHORIZATION;
  }

  axios(config)
    .then(response => {
      const successValue = onSuccess(response.data);
      if (successValue && typeof successValue === "string") toast.success(successValue);
    })
    .catch(error => {
      const errorMessage = error && error.response && error.response.data && error.response.data.message;
      const errorValue = onError((typeof errorMessage === "string" && errorMessage) || "Ooops! Something went wrong");
      if (errorValue) toast.error(errorValue);
      console.log(error);
    })
    .finally(onFinally);
};
