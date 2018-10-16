import { ADD_USER_PROFILE, REMOVE_USER_PROFILE } from '../constants';

let initialUser = {
    name: null,
    publicID: null
}

export default (state = initialUser, action) => {
    switch (action.type) {

        case ADD_USER_PROFILE:
            const { name, publicID } = action;
            return { name,  publicID };
        case REMOVE_USER_PROFILE:
            return initialUser;
        default:
            return state;
    }
}