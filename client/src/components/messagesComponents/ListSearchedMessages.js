import React, { Component } from 'react';
import { connect } from 'react-redux';

import ListedSingleBlog from './ListedSingleBlog'
class ListSearchedMessages extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            numberOfmessages: -1,
            emptyAJAX: false
        };


    }


    componentDidUpdate(prevProps, prevState) {
        // only update  if the data has changed
    //    console.log("this.props",this.props)
        if (prevProps.location.pathname !== this.props.location.pathname) {
            window.scrollTo(0, 0);
            //  console.log("didupdate", this.props.location.pathname)
         //   this.props.getNewMessagesAction(0, this.props.location.pathname.slice(1));
         //oVDE TREBA DA SE STAVI ACTION CREATER..... MOZDA I NE TREB< MOZDA CE TO NAVBAR DA SREDI
            this.setState({ emptyAJAX: false, numberOfmessages: -1, });
        }
    }
    componentWillReceiveProps(newProps) {
         if (newProps.location.pathname === this.props.location.pathname) {


            this.setState({ loading: false, numberOfmessages: newProps.messages.length });
            if (this.state.numberOfmessages === newProps.messages.length && newProps.messages.length !== -1)
                this.setState({ emptyAJAX: true })
        }
    }




    render() {
        const MessageList = this.props.messages.map((message) =>
            <ListedSingleBlog key={message.publicID} message={message} imageQueryID = {this.props.imageQueryID} />);
        return (
            <div className="shadow p-3 m-2 bg-white rounded">
                {MessageList}
                {(this.state.emptyAJAX) ? <div> There are no more messages... </div> : null}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        messages: state.messages,
        imageQueryID: state.user.imageQueryID
    }
}

export default connect(mapStateToProps, null)(ListSearchedMessages);