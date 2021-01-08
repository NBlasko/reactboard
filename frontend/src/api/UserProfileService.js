import { baseHttp } from "./baseHttp";

export const UserProfileService = {
  getManyBlogs: ({ data, onSuccess, onError, onFinally }) => {
    baseHttp({
      method: "GET",
      url: "profile/getManyBlogs",
      data,
      isAuthorized: false,
      onSuccess,
      onError,
      onFinally
    });
  },

   /**
   *
   * @param {*} param
   * queryString.searchText is mandatory
   */
  searchMany: ({ data, onSuccess, onError, onFinally, queryString }) => {
    baseHttp({
      method: "GET",
      url: `profile/search?searchText=${queryString.searchText}`,
      data,
      isAuthorized: false,
      onSuccess,
      onError,
      onFinally
    });
  },

  getLoggedIn: ({ data, onSuccess, onError, onFinally }) => {
    baseHttp({
      method: "GET",
      url: "profile/loggedIn",
      data,
      isAuthorized: false,
      onSuccess,
      onError,
      onFinally
    });
  },

  /**
   *
   * @param {*} param
   * params.userProfileId is mandatory
   */
  getOne: ({ data, onSuccess, onError, onFinally, params }) => {
    baseHttp({
      method: "GET",
      url: `profile/userProfileId/${params.userProfileId}`,
      data,
      isAuthorized: false,
      onSuccess,
      onError,
      onFinally
    });
  },

  /**
   *
   * @param {*} param
   * params.userProfileId is mandatory
   */
  upsertTrust: ({ data, onSuccess, onError, onFinally, params }) => {
    baseHttp({
      method: "POST",
      url: `profile/userProfileId/${params.userProfileId}/trust`,
      data,
      isAuthorized: false,
      onSuccess,
      onError,
      onFinally
    });
  }
};
