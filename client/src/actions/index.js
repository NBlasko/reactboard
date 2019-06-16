import {
  SERVERURL,
  ADD_USER_PROFILE, REMOVE_USER_PROFILE, USER_SIGNED,
  ADD_MESSAGE, GET_MESSAGES, GET_NEW_MESSAGES, DELETE_MESSAGE, DELETE_ALL_MESSAGES,
  GET_SINGLE_MESSAGE, DELETE_SINGLE_MESSAGE,
  GET_COMMENTS, GET_NEW_COMMENTS, DELETE_ALL_COMMENTS, ADD_COMMENT,
  GET_SINGLE_USER,REMOVE_SINGLE_USER,  SEARCH_PROFILES, REMOVE_PROFILES, ADD_PROFILE_TRUST,
  GET_GALLERY_LIST, GET_NEW_GALLERY_LIST, REMOVE_GALLERY_IMAGE, REMOVE_GALLERY_LIST,
  ADD_GALLERY_IMAGE, SET_PROFILE_IMAGE, SET_BLOG_IMAGE, REMOVE_PREVIEW_BLOG_IMAGE,
  ADD_BLOGS_LIKE,
  //REFRESH
} from '../constants';//import axios from 'axios';

import axios from "axios";

export const userSigned = (bool) => ({
  type: USER_SIGNED,
  bool
});


//user Name

export const addUserProfile = () => dispatch => {
  const API_URL = SERVERURL + 'auth/secret';
  axios(API_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
  })
    .then((res) => {
      // console.log(res);
      dispatch({
        type: ADD_USER_PROFILE,
        name: res.data.name,
        publicID: res.data.publicID,
        imageQueryID: res.data.imageQueryID
      })
    })
    .catch((error) => {
      console.log(error);
    })
}





export const removeUserProfile = () => ({
  type: REMOVE_USER_PROFILE,
})



// messages






export const addMessageAction = ({ text, title, imageId }) => dispatch => {
  axios({
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
    data: {
      "title": title,
      "body": text,
      "imageId": imageId
    },
    url: SERVERURL + 'api/blogs',
  })
    .then(res => {
      console.log(res);
      dispatch({
        type: ADD_MESSAGE,
        payload: res.data
      })
    })
    .catch(error => {
      console.log(error)
    });
}


export const getMessagesAction = (skip, criteria) => dispatch => {
  const newCriteria = (criteria === "") ? "new" : criteria;
  axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
    url: SERVERURL + 'api/blogs?skip=' + skip + '&criteria=' + newCriteria,
  }).then(res => {
    dispatch({
      type: GET_MESSAGES,
      payload: res.data
    })
  })
    .catch(error => console.log(error));
};


export const searchBlogsAction = (searchText) => dispatch => {
  axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
    url: SERVERURL + 'api/blogs/search?searchText=' + searchText,
  }).then(res => {
    console.log("resSearch", res)
    dispatch({
      type: GET_NEW_MESSAGES,
      payload: res.data.result
    })
  })
    .catch(error => console.log(error));
};


export const getNewMessagesAction = (skip, criteria) => dispatch => {
  const newCriteria = (criteria === "") ? "new" : criteria;
  axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
    url: SERVERURL + 'api/blogs?skip=' + skip + '&criteria=' + newCriteria,
  }).then(res => {
    dispatch({
      type: GET_NEW_MESSAGES,
      payload: res.data
    })
  })
    .catch(error => console.log(error));
};

export const deleteAllMessagesAction = () => ({
  type: DELETE_ALL_MESSAGES
});



export const getSingleMessageAction = (blogID) => dispatch => {
  axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
    url: SERVERURL + 'api/blogs/' + blogID,
  }).then(res => {
    dispatch({
      type: GET_SINGLE_MESSAGE,
      payload: res.data
    })
  })
    .catch(error => console.log(error));
};


export const getCommentsAction = (blogID, skip) => dispatch => {
  axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
    url: SERVERURL + 'api/blogs/' + blogID
     + '/comments?skip=' + skip,
  }).then(res => {
    dispatch({
      type: GET_COMMENTS,
      payload: res.data
    })
  })
    .catch(error => console.log(error));
};

export const getNewCommentsAction = (blogID, skip) => dispatch => {
  axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
    url: SERVERURL + 'api/blogs/' + blogID
     + '/comments?skip=' + skip,
  }).then(res => {
    dispatch({
      type: GET_NEW_COMMENTS,
      payload: res.data
    })
  })
    .catch(error => console.log(error));
};


export const deleteAllCommentsAction = () => ({
  type: DELETE_ALL_COMMENTS
});



export const addCommentAction = ({ author, text, blogsID, authorsPublicID }) => dispatch => {
  axios({
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
    data: {
      "author": author,
      "body": text,
      "authorsPublicID": authorsPublicID,
      //
    },
    url: SERVERURL + 'api/blogs/' + blogsID + '/comments',
  })
    .then(res => {
      console.log(res);
      dispatch({
        type: ADD_COMMENT,
        payload: res.data
      })
    })
    .catch(error => {
      console.log(error)
    });
}


//blog likes

export const addBlogsLikeAction = ({ like, blogsID }) => dispatch => {
  axios({
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
    data: {
      "like": like
    },
    url: SERVERURL + 'api/blogs/' + blogsID + '/like',
  })
    .then(res => {
      console.log(res);
      dispatch({
        type: ADD_BLOGS_LIKE,
        payload: res.data
      })
    })
    .catch(error => {
      console.log(error)
    });
}




// profiles

export const getSingleUserAction = (publicID) => dispatch => {
  axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
    url: SERVERURL + 'api/profiles/' + publicID,
  }).then(res => {
    dispatch({
      type: GET_SINGLE_USER,
      payload: res.data
    })
  })
    .catch(error => console.log(error));
};



export const removeSingleUserAction = () => ({
  type: REMOVE_SINGLE_USER,
});




export const searchProfilesAction = (searchText) => dispatch => {
  axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
    url: SERVERURL + 'api/profiles/search?searchText=' + searchText,
  }).then(res => {
    console.log("res profiles Search", res)
    dispatch({
      type: SEARCH_PROFILES,
      payload: res.data.result
    })
  })
    .catch(error => console.log(error));
};



export const removeProfilesAction = () => ({
  type: REMOVE_PROFILES,
});

export const getProfileMessagesAction = (skip, authorsPublicID) => dispatch => {

  axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
    url: SERVERURL + 'api/profiles?skip=' + skip + '&authorsPublicID='
      + authorsPublicID,
  }).then(res => {
    dispatch({
      type: GET_MESSAGES,
      payload: res.data
    })
  })
    .catch(error => console.log(error));
};

export const getNewProfileMessagesAction = (skip, authorsPublicID) => dispatch => {

  axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
    url: SERVERURL + 'api/profiles?skip='
      + skip + '&authorsPublicID=' + authorsPublicID,
  }).then(res => {
    dispatch({
      type: GET_NEW_MESSAGES,
      payload: res.data
    })
  })
    .catch(error => console.log(error));
};

export const addProfileTrustAction = ({ trust, blogsID }) => dispatch => {
  axios({
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
    data: {
      "trust": trust
    },
    url: SERVERURL + 'api/profiles/' + blogsID + '/trust',
  })
    .then(res => {
      console.log(res);
      dispatch({
        type: ADD_PROFILE_TRUST,
        payload: res.data
      })
    })
    .catch(error => {
      console.log(error)
    });
}



export const getGalleryListAction = (skip) => dispatch => {

  axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
    url: SERVERURL + 'api/images/gallerylist?skip=' + skip,
  }).then(res => {
    dispatch({
      type: GET_GALLERY_LIST,
      payload: res.data
    })
  })
    .catch(error => console.log(error));
};

export const getNewGalleryListAction = (skip) => dispatch => {

  axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
    url: SERVERURL + 'api/images/gallerylist?skip='  + skip ,
  }).then(res => {
    dispatch({
      type: GET_NEW_GALLERY_LIST,  //this one overwrites the state, not just adds new elements in the list
      payload: res.data
    })
  })
    .catch(error => console.log(error));
};


export const removeGalleryImageAction = (id) => ({
  type: REMOVE_GALLERY_IMAGE,
  id
});


export const removeGalleryListAction = () => ({
  type: REMOVE_GALLERY_LIST,
});


export const addGalleryImageAction = (id) => ({
  type: ADD_GALLERY_IMAGE,
  payload: { _id: id }
});



export const setProfileImageAction = ({ id }) => dispatch => {
  axios({
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
    data: {
      param: id  //this is image id generated by mongoDB
    },
    url: SERVERURL + 'api/images/profileimage',
  })
    .then(res => {
      console.log(res);
      dispatch({
        type: SET_PROFILE_IMAGE,
        payload: res.data
      })
    })
    .catch(error => {
      console.log(error)
    });
}


export const setBlogImageAction = (id) => ({
  type: SET_BLOG_IMAGE,
  id
});
export const removePreviewBlogImageAction = () => ({
  type: REMOVE_PREVIEW_BLOG_IMAGE,
});




// refresh components
// mozda mi i ne zatreba
/*export const refreshAction = (date) => ({
  type: REFRESH,
  date
});
*/

export const deleteMessageAction = (id) => ({
  type: DELETE_MESSAGE,
  id
});

export const deleteSingleMessageAction = () => ({
  type: DELETE_SINGLE_MESSAGE
});