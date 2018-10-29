import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getMessagesAction, deleteAllMessagesAction } from '../../actions'
import ListedSingleBlog from './ListedSingleBlog'
class ListMessages extends Component {


    componentDidMount() {
      
        this.props.getMessagesAction();
    }
    componentWillUnmount() {
      
        this.props.deleteAllMessagesAction();
    }

    render() {
        const MessageList = this.props.messages.map((message) =>
            <ListedSingleBlog key={message.publicID} message={message} />);
        return (
            <div>
                {MessageList}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        messages: state.messages
    }
}

export default connect(mapStateToProps, { getMessagesAction, deleteAllMessagesAction })(ListMessages);
