const initialstate = "";

const searchText = (state = initialstate, action) => {
    switch (action.type) {

        case "searchText/SET":
            return action.payload;

        default:
            return state
    }
}

export default searchText;