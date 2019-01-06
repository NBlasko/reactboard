import {
  SET_BLOG_IMAGE, REMOVE_PREVIEW_BLOG_IMAGE
} from '../constants'

const initialstate = { id: "" };

const refresh = (state = initialstate, action) => {
  switch (action.type) {

    case SET_BLOG_IMAGE:
      return action.id;

    case REMOVE_PREVIEW_BLOG_IMAGE:
      return initialstate;

    default:
      return state
  }
}

export default refresh;