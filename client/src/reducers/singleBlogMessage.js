import {
    GET_SINGLE_MESSAGE, DELETE_SINGLE_MESSAGE, ADD_MESSAGE,
    ADD_COMMENT
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

        case DELETE_SINGLE_MESSAGE:
            return initialstate;

        default:
            return state;
    }
}

export default singleBlogMessage;