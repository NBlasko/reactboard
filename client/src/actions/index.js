import {
  ADD_USER_PROFILE, REMOVE_USER_PROFILE, USER_SIGNED,
  ADD_MESSAGE, GET_MESSAGES, DELETE_MESSAGE, DELETE_ALL_MESSAGES,
  GET_SINGLE_MESSAGE, DELETE_SINGLE_MESSAGE,
  GET_COMMENTS, DELETE_ALL_COMMENTS, ADD_COMMENT
} from '../constants';//import axios from 'axios';

import axios from "axios";

export const userSigned = (bool) => ({
  type: USER_SIGNED,
  bool
});


//user Name

export const addUserProfile = () => dispatch => {
  const API_URL = 'http://localhost:3001/auth/secret';
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
        publicID : res.data.publicID
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
      "author": author,
      "body": text,
      "authorsPublicID": authorsPublicID
    },
    url: 'http://localhost:3001/api/blogs',
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

 
export const getMessagesAction = () => dispatch => {
  axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
    url: 'http://localhost:3001/api/blogs',
  }).then(res => {
    dispatch({
      type: GET_MESSAGES,
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
    url: 'http://localhost:3001/api/blogs/'+blogID,
  }).then(res => {
    dispatch({
      type: GET_SINGLE_MESSAGE,
      payload: res.data
    })
  })
    .catch(err => console.log(err));
};


export const getCommentsAction = (blogID) => dispatch => {
  axios({
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.reactBoardToken}`,
      'Cache-Control': 'no-cache'
    },
    url: 'http://localhost:3001/api/blogs/' + blogID + '/comments',
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
    url: 'http://localhost:3001/api/blogs/' + blogsID + '/comments',
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





export const deleteMessageAction = (id) => ({
  type: DELETE_MESSAGE,
  id
});

export const deleteSingleMessageAction = () => ({
  type: DELETE_SINGLE_MESSAGE
});