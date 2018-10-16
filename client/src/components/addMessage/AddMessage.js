import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addMessageAction } from '../../actions'

class AddMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            title: ''
        }
        this.addMessage = this.addMessage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleKeyPress(e) {
        if (e.key === 'Enter' && this.state.text !== '') {
            this.props.addMessageAction(this.state.text);
            this.setState({ text: '' });
        }
    }
    addMessage() {
        if (this.state.text === '') return;
        //   this.props.addMessageAction(this.state.text);
        this.props.addMessageAction({
            author: this.props.name,
            text: this.state.text,
            title: this.state.title,
            authorsPublicID: this.props.publicID
        });

        this.setState({ text: '', title: '' });
    }

    render() {

        return (
            <div>
                <input type='text' value={this.state.title} name="title" onKeyPress={this.handleKeyPress} onChange={this.handleChange} />
                <div><textarea type='text' value={this.state.text} name="text" onKeyPress={this.handleKeyPress} onChange={this.handleChange} />
                </div>
                <button onClick={this.addMessage}> Enter </button>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        name: state.user.name,
        publicID: state.user.publicID
    }
}

export default connect(mapStateToProps, { addMessageAction })(AddMessage);
