import {
    USER_SIGNED,
    REMOVE_USER_PROFILE
} from '../constants';

let initialUser = {
    signed: false
}

export default (state = initialUser, action) => {
    switch (action.type) {

        case USER_SIGNED:
            const { bool } = action;
            return { signed: bool };

        case REMOVE_USER_PROFILE:
            return initialUser;

        default:
            return state;
    }
}