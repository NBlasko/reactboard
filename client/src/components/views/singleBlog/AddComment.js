import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addCommentAction } from '../../../store/actions';



class AddComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: ''
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({ comment: e.target.value })
    }
    handleClick() {
        if (this.state.comment !== '') {
            this.setState({ comment: '' });
            this.props.addCommentAction({
                author: this.props.name,
                text :this.state.comment,
                blogsID : this.props.blogsID,
                authorsPublicID: this.props.publicID
            });
        
 
        }
    }


    render() {
        return (
            <div className="card-footer bg-transparent border-light">
                <div className="input-group mb-3">
                    <textarea type="text" name="comment" value={this.state.comment}  className="form-control" onChange={this.handleChange} rows="4" placeholder="Type a comment..." />
                </div>
                <div className="text-right">
                    <button className="btn btn-secondary" onClick={this.handleClick} type="button">Submit</button>
                </div>
            </div>

        )

    }
}

const mapStateToProps = (state) => {

    return ({
        publicID: state.user.publicID,
        name: state.user.name,
    })
}

export default connect(mapStateToProps, { addCommentAction })(AddComment);