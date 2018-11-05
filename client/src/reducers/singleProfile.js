import {
    GET_SINGLE_USER
} from '../constants'

const initialstate = null;

const singleUserAction = (state = initialstate, action) => {
    switch (action.type) {

        case GET_SINGLE_USER:
            return action.payload;

      /*  case ADD_PROFILE_TRUST:
            let newPayload2 = { ...state };
            newPayload2.statistics.trustVote = action.payload.trustVote;
            newPayload2.UserVotedUp = action.payload.UserVotedUp;
            newPayload2.UserVotedDown = action.payload.UserVotedDown;
            return newPayload2;
*/


        default:
            return state;
    }
}

export default singleUserAction;