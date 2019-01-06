import {
  SET_PROFILE_IMAGE
} from '../constants'

const initialstate = 0;

const refresh = (state = initialstate, action) => {
  switch (action.type) {


    case SET_PROFILE_IMAGE:
      return action.payload.refresh;

    
    default:
      return state
  }
}

export default refresh;