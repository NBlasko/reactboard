//SEARCH_PROFILES
import {
  SEARCH_PROFILES, REMOVE_PROFILES,
  REMOVE_USER_PROFILE
} from '../constants'

const initialstate = [];

const profiles = (state = initialstate, action) => {
  switch (action.type) {

    case SEARCH_PROFILES:
      return [
        ...action.payload];

    //  case DELETE_ALL_MESSAGES: Da ubacim brisanje svega sa signout reducerom i component will unmount 
    // kad dodam taj action creater, otom potom
    //    return [];

    case REMOVE_PROFILES:
      return initialstate;


    case REMOVE_USER_PROFILE:
      return initialstate;

    default:
      return state
  }
}

export default profiles;