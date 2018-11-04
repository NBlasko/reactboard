import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteMessageAction } from '../../actions'
import { Link } from 'react-router-dom';


class ListedSingleBlog extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.props.deleteMessageAction(e.target.id);
    }
    render() {
        const { message } = this.props;
        const{ trustVote, likeVote }= message.statistics;
        let trustPercent = 50, likePercent = 50;
        if (trustVote && trustVote.number.Up + trustVote.number.Down !== 0) {
            trustPercent =Math.round(trustVote.number.Up / (trustVote.number.Up + trustVote.number.Down) *100);
        }
        if (likeVote && likeVote.number.Up + likeVote.number.Down !== 0) {
            likePercent =Math.round(likeVote.number.Up / (likeVote.number.Up + likeVote.number.Down) *100);
        }
        let localDate = new Date(message.date).toLocaleString() + "";
        return (
            <div id={message.publicID} >
                <h4><Link to={'./blog/' + message.publicID}> {message.title}</Link>  <small className="text-muted"> by {message.author} </small></h4> 
                <p>{message.body}</p>
                <span className="small pr-3"> <i className="fa fa-check-square-o"></i> {trustPercent}% </span>
                <span className="small pr-3"> <i className="fa fa-eye"></i> {message.statistics.seen} </span>
                <span className="small pr-3"> <i className="fa fa-thumbs-up"></i> {likePercent}% </span>
                <span className="small pr-3"> <i className="fa fa-comment"></i> {message.statistics.numberOfComments} </span>
                {// u komentar dok ne sredim dugme za brisanje   <button className="btn btn-danger" id={message.publicID} onClick={this.handleClick} > &times; </button>
                }
                 <small className="text-muted"> {localDate.slice(0, -3)} </small>
                <hr/>
            </div>

        )

    }
}

export default connect(null, { deleteMessageAction })(ListedSingleBlog);