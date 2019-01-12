import {
  SET_PROFILE_IMAGE,
  REMOVE_USER_PROFILE
} from '../constants'

const initialstate = 0;

const refresh = (state = initialstate, action) => {
  switch (action.type) {


    case SET_PROFILE_IMAGE:
      return action.payload.refresh;

    case REMOVE_USER_PROFILE:
      return initialstate;

    default:
      return state
  }
}

export default refresh;