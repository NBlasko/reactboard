import { GET_COMMENTS, DELETE_ALL_COMMENTS, ADD_COMMENT } from '../constants'

const initialstate = [];

const comments = (state = initialstate, action) => {
  switch (action.type) {

    case GET_COMMENTS:
      return [
        ...state, ...action.payload];

    case ADD_COMMENT:
    console.log("c",action.payload)
      return [
        ...state, action.payload.newComment];
       

    //   case DELETE_MESSAGE:
    //    const newState = state.filter(message => message.id !== action.id)
    //    return [...newState];

    case DELETE_ALL_COMMENTS:
      return [];

    default:
      return state
  }
}

export default comments;