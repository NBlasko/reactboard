import {
  GET_COMMENTS,
  DELETE_ALL_COMMENTS,
  ADD_COMMENT,
  GET_NEW_COMMENTS,
  REMOVE_USER_PROFILE
} from '../types/types';

const initialstate = [];

const comments = (state = initialstate, action) => {
  switch (action.type) {

    case GET_COMMENTS:
      return [
        ...state, ...action.payload];

    case GET_NEW_COMMENTS:
      return [
        ...action.payload];

    case ADD_COMMENT:
      return [
        action.payload.newComment, ...state];


    //   case DELETE_MESSAGE:
    //    const newState = state.filter(message => message.id !== action.id)
    //    return [...newState];
    case REMOVE_USER_PROFILE:
      return initialstate;

    case DELETE_ALL_COMMENTS:
      return [];

    default:
      return state
  }
}

export default comments;