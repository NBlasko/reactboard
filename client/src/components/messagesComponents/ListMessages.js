import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getMessagesAction, deleteAllMessagesAction, getNewMessagesAction } from '../../actions'
import ListedSingleBlog from './ListedSingleBlog'
class ListMessages extends Component {

    constructor(props) {
        super(props);
        this.state = {
            skip: 5,
            loading: false,
            numberOfmessages: -1,
            emptyAJAX: false
        };
        this.handleScroll = this.handleScroll.bind(this);

    }
    componentDidMount() {
        console.log("props mount in listmessages", this.props.location.pathname.slice(1))
        this.props.getNewMessagesAction(0, this.props.location.pathname.slice(1));
      /*  this.scrollListener =*/ window.addEventListener('scroll', this.handleScroll)
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
        this.props.deleteAllMessagesAction();
    }
    componentDidUpdate(prevProps, prevState) {
        // only update  if the data has changed
        if (prevProps.location.pathname !== this.props.location.pathname) {
            window.scrollTo(0, 0);
          //  console.log("didupdate", this.props.location.pathname.slice(1))
            this.props.getNewMessagesAction(0, this.props.location.pathname.slice(1));
            this.setState({ skip: 5, emptyAJAX: false, numberOfmessages: -1, });
        }
    }
    componentWillReceiveProps(newProps) {

        if (newProps.location.pathname === this.props.location.pathname) {
            this.setState({ loading: false, numberOfmessages: newProps.messages.length });
            if (this.state.numberOfmessages === newProps.messages.length && newProps.messages.length !== -1)
                this.setState({ emptyAJAX: true })
        }
    }



handleScroll(e) {
    if (!this.state.loading && !this.state.emptyAJAX) {
        const lastDiv = document.getElementById(this.props.messages[this.props.messages.length - 1].publicID)
        const lastDivOffset = lastDiv.offsetTop + lastDiv.clientHeight;
        const pageOffset = window.pageYOffset + window.innerHeight;
        const bottomOffset = 20;
        if (pageOffset > lastDivOffset - bottomOffset) {
            this.setState({ loading: true })   //I wanted two call here on setState
            this.props.getMessagesAction(this.state.skip, this.props.location.pathname.slice(1));
            this.setState((previousState) => {
                return { skip: previousState.skip + 5 };
            });
        }
    }
}

render() {
    const MessageList = this.props.messages.map((message) =>
        <ListedSingleBlog key={message.publicID} message={message} />);
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
        messages: state.messages
    }
}

export default connect(mapStateToProps, { getMessagesAction, deleteAllMessagesAction, getNewMessagesAction })(ListMessages);
