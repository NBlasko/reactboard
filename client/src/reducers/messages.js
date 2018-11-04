import { GET_MESSAGES, DELETE_MESSAGE, DELETE_ALL_MESSAGES, GET_NEW_MESSAGES } from '../constants'

const initialstate = [];

const messages = (state = initialstate, action) => {
  switch (action.type) {

    case GET_MESSAGES:
      return [
        ...state, ...action.payload];
    case GET_NEW_MESSAGES:
        return [...action.payload]
    case DELETE_MESSAGE:
      const newState = state.filter(message => message.id !== action.id)
      return [...newState];

    case DELETE_ALL_MESSAGES:
      return [];

    default:
      return state
  }
}

export default messages;