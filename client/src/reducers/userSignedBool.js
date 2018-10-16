import { USER_SIGNED } from '../constants';

let initialUser = {
    signed: false
}

export default (state = initialUser, action) => {
    switch (action.type) {

        case USER_SIGNED:
            const { bool } = action;
            return { signed : bool };

        default:
            return state;
    }
}