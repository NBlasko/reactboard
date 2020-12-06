import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import useSearch from '../../utils/search/useSearch';
import Paper from '@material-ui/core/Paper';
import ListedSingleBlog from '../../utils/blogComponents/ListedSingleBlogMui';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import OrderByMessages from './OrderByMessages';
import SearchMessages from './SearchMessages';

const useStyles = makeStyles({
    rootSearchMobile: {
        flexGrow: 1,
        margin: "0 auto",
        maxWidth: "600px",
        display: "flex",
        flexDirection: "row",
    },

    rootSearchDesktop: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        margin: "0 auto",
        maxWidth: "600px"
    },
});

function ListMessages(props) {
    const classes = useStyles();
    const isMobileView = useMediaQuery('(min-width:400px)');
    const [skip, setSkip] = useState(0);
    const [messages, setMessages] = useState([]);
    const criteria = props.location.pathname.slice(1);
    let searchText = useSelector(state => state.searchText);

    useEffect(() => {
        window.scrollTo(0, 0);
        setMessages([]);
        setSkip(0)
        return () => {
            setSkip(0);
        }
    }, [searchText, criteria])


    const {
        loading,
        error,
        hasMore
    } = useSearch({
        searchText,
        skip,
        criteria,
        setMessages
    });

    const imageQueryID = useSelector(state => state.user.imageQueryID);

    const observer = useRef()
    const lastMessageElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setSkip(prevSkip => prevSkip + 5)
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    const MessageList = messages.map((message, index) => {
        if (messages.length === index + 1) {
            return <div
                ref={lastMessageElementRef}
                key={message.publicID}
            >
                <ListedSingleBlog
                    key={message.publicID}
                    message={message}
                    imageQueryID={imageQueryID}
                />
            </div>
        } else {
            return <div key={message.publicID}>
                <ListedSingleBlog
                    key={message.publicID}
                    message={message}
                    imageQueryID={imageQueryID}
                />
            </div>
        }
    });

    return (
        <div className="shadow p-3 m-2 bg-white rounded">
            <Paper className={(isMobileView)
                ? classes.rootSearchMobile
                : classes.rootSearchDesktop}
            >
                <SearchMessages />
                <OrderByMessages />
            </Paper>

            {MessageList}
            {error && <div>{error} </div>}
            {loading && <div> loading... </div>}
            {!loading && !hasMore && <div> There are no more messages... </div>}
        </div>
    );
}

export default ListMessages;
