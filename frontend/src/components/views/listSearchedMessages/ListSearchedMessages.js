import React, { useState, useEffect } from 'react';
import { useSelector, } from 'react-redux';

import ListedSingleBlog from '../../utils/blogComponents/ListedSingleBlog';
// class ListSearchedMessages extends Component {
//     componentDidUpdate(prevProps, prevState) {
//         if (prevProps.location.pathname !== this.props.location.pathname) {
//             window.scrollTo(0, 0);
//             this.setState({ isEmptyAJAX: false, numberOfmessages: -1, });
//         }
//     }
//     componentWillReceiveProps(newProps) {
//         if (newProps.location.pathname === this.props.location.pathname) {
//             this.setState({ isLoading: false, numberOfmessages: newProps.messages.length });
//             if (this.state.numberOfmessages === newProps.messages.length && newProps.messages.length !== -1)
//                 this.setState({ isEmptyAJAX: true })
//         }
//     }
// }



function ListSearchedMessages(props) {


    const messages = useSelector(state => state.messages)
    const imageQueryID = useSelector(state => state.user.imageQueryID)


  //  const [isLoading, setIsLoading] = useState(false);
    const [isEmptyAJAX/*, setIsEmptyAJAX*/] = useState(false);
  //  const [numberOfmessages, setNumberOfmessages] = useState(-1);

    const { pathname } = props.location;



    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname])


    const MessageList = messages.map((message) =>
        <ListedSingleBlog
            key={message.publicID}
            message={message}
            imageQueryID={imageQueryID}
        />)
        ;


    return (
        <div className="shadow p-3 m-2 bg-white rounded">
            O Ovome pricamo
            {MessageList}
            {(isEmptyAJAX) ? <div> There are no more messages... </div> : null}
        </div>)

}

export default ListSearchedMessages;