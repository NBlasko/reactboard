import { GET_SINGLE_MESSAGE, DELETE_SINGLE_MESSAGE, ADD_MESSAGE } from '../constants'

const initialstate = null;

const singleBlogMessage = (state = initialstate, action) => {
    switch (action.type) {
        case ADD_MESSAGE:
        return { payload: action.payload}
        case GET_SINGLE_MESSAGE:
            return action.payload;

        case DELETE_SINGLE_MESSAGE:
            return initialstate;

        default:
            return state;
    }
}

export default singleBlogMessage;