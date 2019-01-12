import {
    GET_GALLERY_LIST, REMOVE_GALLERY_LIST,
    REMOVE_USER_PROFILE
} from '../constants'

const initialstate = {
    number: -1
};

const galleryList = (state = initialstate, action) => {
    switch (action.type) {


        case GET_GALLERY_LIST:
            const number = action.payload.galleryList.length;
            return { number };


        case REMOVE_GALLERY_LIST:
            return initialstate;

        case REMOVE_USER_PROFILE:
            return initialstate;


        default:
            return state
    }
}

export default galleryList;