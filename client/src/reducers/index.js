import { combineReducers } from 'redux';
import  messages  from './messages';
import  user  from './user';
import  userSignedBool  from './userSignedBool';
import  singleBlogMessage  from './singleBlogMessage';
import  singleProfile  from './singleProfile';
import  comments from './comments';
import  galleryList from './galleryList';
import refresh from './refresh';
import numberOfData from './numberOfData';
import previewBlogImage from './previewBlogImage'
import profiles from './profiles';

export default combineReducers(
    { messages, user, userSignedBool, singleBlogMessage, comments,
     searchedProfile: singleProfile, profiles,
     galleryList,
     refresh,
     numberOfData,
     previewBlogImage,
    }
);