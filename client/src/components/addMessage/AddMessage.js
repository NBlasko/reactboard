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
        if (this.state.text === '' || this.state.title ==='') return;  //izbaci neku poruku da je potrebno popuniti polja
        this.props.addMessageAction({
            text: this.state.text,
            title: this.state.title,
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



export default connect( null , { addMessageAction })(AddMessage);
