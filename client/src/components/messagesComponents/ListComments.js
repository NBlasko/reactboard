import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCommentsAction, deleteAllCommentsAction } from '../../actions'
import SingleComment from './SingleComment';
class ListComments extends Component {


    componentDidMount() {
console.log("blogID u list props",this.props.blogID)
        this.props.getCommentsAction(this.props.blogID);
    }
    componentWillUnmount() {

        this.props.deleteAllCommentsAction();
    }

    render() {
        console.log("this.props u ListComments",this.props.comments)
         const commentList = this.props.comments.map((comment) =>
            <SingleComment key={comment._id} message={comment} />);
             //sada je ok da koristim comment._id, jer i ako ga ostali znaju ne mogu stetu da nacine
             // mislim da mi nije potreban ni publicBlogID, on nema veze sa jwt, zato cu ga obrisati prvom prilikom
        return (
            <div>
                Komentari
                {commentList
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
          comments: state.comments
    }
}

export default connect(mapStateToProps, { getCommentsAction, deleteAllCommentsAction })(ListComments);