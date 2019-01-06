import { GET_GALLERY_LIST, REMOVE_GALLERY_LIST, REMOVE_GALLERY_IMAGE,
  ADD_GALLERY_IMAGE
 } from '../constants'

const initialstate = [];

const galleryList = (state = initialstate, action) => {
  switch (action.type) {


    case GET_GALLERY_LIST:
      return [...state, ...action.payload.galleryList];


    case ADD_GALLERY_IMAGE:
      return [action.payload, ...state ];

    case REMOVE_GALLERY_IMAGE:

      const newState = state.filter(singleImage => singleImage._id !== action.id)
      return [...newState];

    case REMOVE_GALLERY_LIST:
      return [];

    default:
      return state
  }
}

export default galleryList;