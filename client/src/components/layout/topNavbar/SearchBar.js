import React, { useState, useEffect/*, useReducer*/ } from 'react';
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Input
} from 'reactstrap';
//import { useDispatch } from 'react-redux';
// import {
//     searchBlogsAction,
//     searchProfilesAction
// } from '../../../store/actions';
import { setSearchTextAction }
    from '../../../store/actions/searchText'
import { withRouter } from "react-router";
import { useDebounce } from 'use-debounce';
import store from '../../../store/store'

function SearchBar(props) {

    // first props
    const { replace } = props.history;
    //const dispatch = useDispatch();
    const [isOpeninput, setIsOpeninput] = useState(false);
    const [dropInputSelected, setDropInputSelected] = useState("blogs");
    const [searchText, setSearchText] = useState("");
    const [debouncedSearchText] = useDebounce(searchText, 600);

    const toggleInput = () => {
        setIsOpeninput(prevState => !prevState);
    }

    // function reducer(state, action) {
    //     closeToggleInput();
    //     switch (action.type) {

    //         case 'SEARCHED_MESSAGES':
    //             //     store.dispatch(searchBlogsAction(debouncedSearchText));
    //             return state;

    //         case 'SEARCHED_PROFILES':
    //             // store.dispatch(searchProfilesAction(debouncedSearchText))
    //             return state;

    //         default:
    //             return state
    //     }

    // }

    // const localDispatch = useReducer(reducer, 0)[1];

    const handleChange = (e) => {
        setSearchText(e.target.value)
    }

    const handleDropDown = (e) => {
        if (e.target.name === "profiles") {
            setDropInputSelected("profiles")
        } else {
            setDropInputSelected("blogs")
        }
    }

    useEffect(() => {
        if (debouncedSearchText.length > 2 || debouncedSearchText === "")
            //   sendSearch;
            store.dispatch(setSearchTextAction(debouncedSearchText))
        // if (debouncedSearchText !== "") {
        //     if (dropInputSelected === "profiles") {
        //         //     localDispatch({ type: 'SEARCHED_PROFILES' })
        //         store.dispatch(searchProfilesAction(debouncedSearchText))
        //         replace('/listsearchedprofiles');
        //     }
        //     else {
        //         //   localDispatch({ type: 'SEARCHED_MESSAGES' })
        //         store.dispatch(searchBlogsAction(debouncedSearchText));
        //         replace('/searchedmessages');
        //     }
        // }
       // else replace('/');

    }, [debouncedSearchText, dropInputSelected/*, localDispatch*/, replace])



    return (
        <UncontrolledDropdown
            isOpen={isOpeninput}
            toggle={toggleInput}
            className="float-right"
            style={{ margin: "0px" }}
        >
            <DropdownToggle
                className="text-dark tab"
                style={{ margin: "0px", padding: "0px" }}
            >
                <Input
                    className="float-right"
                    placeholder={"search for " + dropInputSelected}
                    style={{ margin: "0px" }}
                    onChange={handleChange}
                />
            </DropdownToggle>

            <DropdownMenu right>
                <DropdownItem
                    onClick={handleDropDown}
                    name="blogs">
                    Blogs {
                        (dropInputSelected === "blogs")
                            ? <i className="fa fa-check"></i>
                            : null
                    }
                </DropdownItem>
                <DropdownItem
                    name="profiles"
                    onClick={handleDropDown}
                > Profiles {
                        (dropInputSelected === "profiles")
                            ? <i className="fa fa-check"></i>
                            : null
                    }
                </DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    )

}

const SearchBarWithRouter = withRouter(SearchBar);


export default SearchBarWithRouter;