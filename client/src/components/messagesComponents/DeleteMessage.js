import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteMessageAction } from '../../actions'
import { Link } from 'react-router-dom';


class DeleteMessage extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.props.deleteMessageAction(e.target.id);
    }
    render() {
        const { message } = this.props;
        return (
            <div className="alert alert-dark">
                <h4><Link to={'./blog/' + message.publicID}> {message.title}</Link>  <small className="text-muted"> by {message.author} </small></h4>
                <p>{message.body}</p>
                <span className="badge badge-pill badge-primary"> <i className="fa fa-check-square-o"></i>  37%</span>
                <span className="badge badge-pill badge-danger"> <i className="fa fa-eye"></i> 67 </span>
                <span className="badge badge-pill badge-success"> <i className="fa fa-thumbs-up"></i>  47%</span>
                <span className="badge badge-pill badge-warning"> <i className="fa fa-comment"></i> 208 </span>
                {// u komentar dok ne sredim dugme za brisanje   <button className="btn btn-danger" id={message.publicID} onClick={this.handleClick} > &times; </button>
                }
            </div>

        )

    }
}

export default connect(null, { deleteMessageAction })(DeleteMessage);