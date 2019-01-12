import {
    GET_SINGLE_USER,
    REMOVE_USER_PROFILE
} from '../constants'

const initialstate = null;

const singleUserAction = (state = initialstate, action) => {
    switch (action.type) {

        case GET_SINGLE_USER:
            return action.payload;

        case REMOVE_USER_PROFILE:
            return initialstate;

        default:
            return state;
    }
}

export default singleUserAction;