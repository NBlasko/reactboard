import {
  SERVERURL,
  ADD_USER_PROFILE, REMOVE_USER_PROFILE, USER_SIGNED,
  ADD_MESSAGE, GET_MESSAGES, GET_NEW_MESSAGES, DELETE_MESSAGE, DELETE_ALL_MESSAGES,
  GET_SINGLE_MESSAGE, DELETE_SINGLE_MESSAGE,
  GET_COMMENTS, DELETE_ALL_COMMENTS, ADD_COMMENT,
  GET_SINGLE_USER ,ADD_PROFILE_TRUST,
  ADD_BLOGS_LIKE
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
      console.log(res);
      dispatch({
        type: ADD_USER_PROFILE,
        name: res.data.name,
        publicID : res.data.publicID,
        image: res.data.image
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






export const addMessageAction = ({ author, text, title, authorsPublicID }) => dispatch => {
  axios({
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
    data: {
      "title": title,
      "body": text
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
    .catch(err => {
      console.log(err)
    });
}

 
export const getMessagesAction = (skip, criteria) => dispatch => {
  const newCriteria = ( criteria === "") ?  "new" : criteria;
  axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
    url: SERVERURL + 'api/blogs?skip='+ skip + '&criteria=' + newCriteria ,
  }).then(res => {
    dispatch({
      type: GET_MESSAGES,
      payload: res.data
    })
  })
    .catch(err => console.log(err));
};


export const getNewMessagesAction = (skip, criteria) => dispatch => {
  const newCriteria = ( criteria === "") ?  "new" : criteria;
  axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
    url: SERVERURL + 'api/blogs?skip='+ skip + '&criteria=' + newCriteria,
  }).then(res => {
    dispatch({
      type: GET_NEW_MESSAGES,
      payload: res.data
    })
  })
    .catch(err => console.log(err));
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
    url: SERVERURL + 'api/blogs/'+blogID,
  }).then(res => {
    dispatch({
      type: GET_SINGLE_MESSAGE,
      payload: res.data
    })
  })
    .catch(err => console.log(err));
};


export const getCommentsAction = (blogID, skip) => dispatch => {
  axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
    url: SERVERURL + 'api/blogs/' + blogID + '/comments?skip='+ skip,
  }).then(res => {
    dispatch({
      type: GET_COMMENTS,
      payload: res.data
    })
  })
    .catch(err => console.log(err));
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
    .catch(err => {
      console.log(err)
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
    .catch(err => {
      console.log(err)
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
    url: SERVERURL + 'api/profiles/'+publicID,
  }).then(res => {
    dispatch({
      type: GET_SINGLE_USER,
      payload: res.data
    })
  })
    .catch(err => console.log(err));
};


export const getProfileMessagesAction = (skip, authorsPublicID) => dispatch => {
 
  axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
    url: SERVERURL + 'api/profiles?skip='+ skip + '&authorsPublicID=' + authorsPublicID ,
  }).then(res => {
    dispatch({
      type: GET_MESSAGES,
      payload: res.data
    })
  })
    .catch(err => console.log(err));
};

export const getNewProfileMessagesAction = (skip, authorsPublicID) => dispatch => {
 
  axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
    url: SERVERURL + 'api/profiles?skip='+ skip + '&authorsPublicID=' + authorsPublicID ,
  }).then(res => {
    dispatch({
      type: GET_NEW_MESSAGES,
      payload: res.data
    })
  })
    .catch(err => console.log(err));
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
    .catch(err => {
      console.log(err)
    });
}












export const deleteMessageAction = (id) => ({
  type: DELETE_MESSAGE,
  id
});

export const deleteSingleMessageAction = () => ({
  type: DELETE_SINGLE_MESSAGE
});