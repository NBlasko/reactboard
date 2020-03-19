import {
  SET_BLOG_IMAGE,
  REMOVE_PREVIEW_BLOG_IMAGE,
  REMOVE_USER_PROFILE,
  UPDATE_PREVIEW_BLOG_IMAGE
} from '../types/types';

const initialstate = { id: "" };

const refresh = (state = initialstate, action) => {
  switch (action.type) {

    case SET_BLOG_IMAGE:
      return action.id;


      // in add message to remove preview image if it's deleted
      // from gallery
    case UPDATE_PREVIEW_BLOG_IMAGE:
      if (state.id === action.id)
        return action.id;
      else
        return initialstate;


    case REMOVE_PREVIEW_BLOG_IMAGE:
      return initialstate;

    case REMOVE_USER_PROFILE:
      return initialstate;

    default:
      return state
  }
}

export default refresh;