import {
    GET_SINGLE_MESSAGE, DELETE_SINGLE_MESSAGE, ADD_MESSAGE,
    ADD_COMMENT,
    ADD_PROFILE_TRUST,
    ADD_BLOGS_LIKE,
    REMOVE_USER_PROFILE
} from '../constants'

const initialstate = null;

const singleBlogMessage = (state = initialstate, action) => {
    switch (action.type) {
        case ADD_MESSAGE:
            return { payload: action.payload }
        case GET_SINGLE_MESSAGE:
            return action.payload;
        case ADD_COMMENT:
            let newPayload = { ...state };
            newPayload.statistics.numberOfComments = action.payload.numberOfComments;
            return newPayload;
        case ADD_PROFILE_TRUST:
            let newPayload2 = { ...state };
            newPayload2.statistics.trustVote = action.payload.trustVote;
            newPayload2.UserVotedUp = action.payload.UserVotedUp;
            newPayload2.UserVotedDown = action.payload.UserVotedDown;
            return newPayload2;
        case ADD_BLOGS_LIKE:
            let newPayload3 = { ...state };
            newPayload3.statistics.likeVote = action.payload.likeVote;
            newPayload3.Like = action.payload.UserLiked;
            newPayload3.Dislike = action.payload.UserDisliked;
            return newPayload3;

        case DELETE_SINGLE_MESSAGE:
            return initialstate;

        case REMOVE_USER_PROFILE:
            return initialstate;

        default:
            return state;
    }
}

export default singleBlogMessage;