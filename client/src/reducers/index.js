import { combineReducers } from 'redux';
import  messages  from './messages';
import  user  from './user';
import  userSignedBool  from './userSignedBool';
import  singleBlogMessage  from './singleBlogMessage';
import  singleProfile  from './singleProfile';
import  comments from './comments';
export default combineReducers(
    { messages, user, userSignedBool, singleBlogMessage, comments,
     searchedProfile: singleProfile
    }
);