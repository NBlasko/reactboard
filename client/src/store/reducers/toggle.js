
let initialState = {
    isDrawerOpen: false
}

export default (state = initialState, action) => {

    switch (action.type) {
        case "leftSidebar/TOGGLE":
            return { ...state, isDrawerOpen: action.payload }

        default:
            return state;
    }
}