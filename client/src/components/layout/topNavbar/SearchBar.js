import React, { useState } from 'react';
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Input
} from 'reactstrap';
import { useDispatch } from 'react-redux';
import {
    searchBlogsAction,
    searchProfilesAction
} from '../../../store/actions';
import { withRouter } from "react-router";
import search from '../../../assets/search.svg'

function SearchBar(props) {


    const [isOpeninput, setIsOpeninput] = useState(false);
    const [dropInputClassBlog, setDropInputClassBlog] = useState("active");
    const [dropInputClassProfile, setDropInputClassProfile] = useState("");
    const [dropInputSelected, setDropInputSelected] = useState("blogs");
    const [searchText, setSearchText] = useState("blogs");

    const dispatch = useDispatch();

    const toggleInput = () => {
        setIsOpeninput(prevState => !prevState);
    }

    const closeToggleInput = () => {
        setIsOpeninput(false);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendSearch();
            closeToggleInput()
        }
    }

    const handleChange = (e) => {
        setSearchText(e.target.value)
    }

    const handleDropDown = (e) => {
        if (e.target.name === "profiles") {
            setDropInputClassBlog("");
            setDropInputClassProfile("active")
            setDropInputSelected("profiles")
        } else {
            setDropInputClassBlog("active");
            setDropInputClassProfile("")
            setDropInputSelected("blogs")
        }
    }

    const sendSearch = () => {
        if (searchText !== "") {
            if (dropInputSelected === "profiles") {
                dispatch(searchProfilesAction(searchText)) //za sad radimo za blogove, kasnije za profile
                props.history.replace('/listsearchedprofiles');
            }
            else {
                dispatch(searchBlogsAction(searchText)) //za sad radimo za blogove, kasnije za profile
                props.history.replace('/searchedmessages');
            }
            props.closeToggle();
        }
    }


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
                    onKeyPress={handleKeyPress}
                    onChange={handleChange}
                />
            </DropdownToggle>

            <DropdownMenu right>
                <DropdownItem
                    onClick={handleDropDown}
                    name="blogs">
                    Blogs {(dropInputClassBlog)
                        ? <i className="fa fa-check"></i>
                        : null
                    }
                </DropdownItem>
                <DropdownItem
                    name="profiles"
                    onClick={handleDropDown}
                > Profiles {(dropInputClassProfile)
                    ? <i className="fa fa-check"></i>
                    : null
                    }
                </DropdownItem>
                <DropdownItem
                    name="searchGo"
                    onClick={sendSearch}
                    className="btn-dark"
                >
                    Start search
                    <img
                        style={{ height: "20px" }}
                        src={search}
                        alt="search"
                    />
                </DropdownItem>

            </DropdownMenu>
        </UncontrolledDropdown>
    )

}

const SearchBarWithRouter = withRouter(SearchBar);


export default SearchBarWithRouter;