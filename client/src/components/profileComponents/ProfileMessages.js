import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getProfileMessagesAction, getNewProfileMessagesAction, deleteAllMessagesAction } from '../../actions'
import ListedSingleBlog from '../messagesComponents/ListedSingleBlog'
class ProfileMessages extends Component {

    constructor(props) {
        super(props);
        this.state = {
            skip: 0,
            loading: false,
            numberOfmessages: -1,
            emptyAJAX: false
        };
        this.handleScroll = this.handleScroll.bind(this);

    }
    componentDidMount() {
        //console.log("props mount in listmessages", this.props.authorsPublicID)
        this.props.getNewProfileMessagesAction(0, this.props.authorsPublicID);
        window.addEventListener('scroll', this.handleScroll)
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
        this.props.deleteAllMessagesAction();
    }

    componentWillReceiveProps(newProps) {

        if (newProps.messages !== this.props.messages)
            this.setState((previousState) => {
                return { skip: previousState.skip + 5 };
            });
        this.setState({ loading: false, numberOfmessages: newProps.messages.length });
        if (this.state.numberOfmessages === newProps.messages.length && newProps.messages.length !== -1)
            this.setState({ emptyAJAX: true })

    }



    handleScroll(e) {
        if (!this.state.loading && !this.state.emptyAJAX && this.props.messages[0]) {
            const lastDiv = document.getElementById(this.props.messages[this.props.messages.length - 1].publicID)
            const lastDivOffset = lastDiv.offsetTop + lastDiv.clientHeight;
            const pageOffset = window.pageYOffset + window.innerHeight;
            const bottomOffset = 20;
            if (pageOffset > lastDivOffset - bottomOffset) {
                this.setState({ loading: true })   //I wanted two call here on setState
                this.props.getProfileMessagesAction(this.state.skip, this.props.authorsPublicID);
            }
        }
    }

    render() {
        const MessageList = this.props.messages.map((message) =>
            <ListedSingleBlog key={message.publicID} message={message} />);
        return (
            <div>
                {MessageList}
                {(this.state.emptyAJAX) ? <div> There are no more messages... </div> : null}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        messages: state.messages,
    }
}

export default connect(mapStateToProps, { deleteAllMessagesAction, getNewProfileMessagesAction, getProfileMessagesAction })(ProfileMessages);
