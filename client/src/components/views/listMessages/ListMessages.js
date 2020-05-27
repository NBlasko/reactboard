import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import useSearch from '../../utils/search/useSearch';
import ListedSingleBlog from '../../utils/blogComponents/ListedSingleBlog';

function ListMessages(props) {
    const [skip, setSkip] = useState(0);
    const [messages, setMessages] = useState([]);
    const criteria = props.location.pathname.slice(1);
    let searchText = useSelector(state => state.searchText);

    useEffect(() => {
        window.scrollTo(0, 0);
        setMessages([]);
        setSkip(0)
        return ()=> {
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
            {MessageList}
            {error && <div>{error} </div>}
            {loading && <div> loading... </div>}
            {!loading && !hasMore && <div> There are no more messages... </div>}
        </div>
    );
}

export default ListMessages;
