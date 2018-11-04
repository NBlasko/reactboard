import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSingleMessageAction, deleteSingleMessageAction, addProfileTrustAction, addBlogsLikeAction } from '../../actions';
import ListComments from './ListComments';
import AddComment from './AddComment';

class SingleBlog extends Component {

    constructor(props) {
        super(props);

        this.addProfileTrustActionUp = this.addProfileTrustActionUp.bind(this);
        this.addProfileTrustActionDown = this.addProfileTrustActionDown.bind(this);
        this.addBlogsLikeActionUp = this.addBlogsLikeActionUp.bind(this);
        this.addBlogsLikeActionDown = this.addBlogsLikeActionDown.bind(this)
    }

    componentDidMount() {
        this.props.getSingleMessageAction(this.props.routeProps.match.params.id);
    }

    componentWillUnmount() {
        this.props.deleteSingleMessageAction();
    }

    addProfileTrustActionUp() {

        this.props.addProfileTrustAction({ trust: 1, blogsID: this.props.routeProps.match.params.id })
    }
    addProfileTrustActionDown() {

        this.props.addProfileTrustAction({ trust: 0, blogsID: this.props.routeProps.match.params.id })
    }

    addBlogsLikeActionUp() {

        this.props.addBlogsLikeAction({ like: 1, blogsID: this.props.routeProps.match.params.id })
    }

    addBlogsLikeActionDown() {

        this.props.addBlogsLikeAction({ like: 0, blogsID: this.props.routeProps.match.params.id })
    }





    render() {
        const trustVote = this.props.trustVote;
        const likeVote = this.props.likeVote;
        let Up = 0, Down = 0, Like = 0, Dislike = 0, localDate = "Date...";
        if (this.props.trustVote) {
            Up = trustVote.number.Up;
            Down = trustVote.number.Down;
        }
        if (this.props.likeVote) {
            Like = likeVote.number.Up;
            Dislike = likeVote.number.Down;
        }
        if (this.props.singleBlogMessage)
            localDate = new Date(this.props.singleBlogMessage.date).toLocaleString() + "";

        const blogContent = (this.props.singleBlogMessage) ?
            <div className="shadow-lg p-3 m-2 bg-white rounded">
                <div className="card border-white mb-3" >
                    <div className="card-body">
                        <h3>{this.props.singleBlogMessage.title}</h3>
                        <h5 className="card-title text-dark"><i>by {this.props.singleBlogMessage.author},</i>  <small className="text-muted"> {localDate.slice(0, -3)} </small>   </h5>                             
                        <p className="card-text">{this.props.singleBlogMessage.body}</p>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="ml-auto col-sm-p-2">{(this.props.singleBlogMessage.authorsPublicID === this.props.publicID) ? <button className="btn btn-danger" type="button">Delete</button> : null}</div>
                            </div>
                            <div className="btn-group col-sm-pr-6 p-1" role="group" aria-label="Trust">
                                <button type="button" onClick={this.addProfileTrustActionUp} className={`btn btn-outline-primary btn-sm ${(this.props.userVotedUp) ? "btn-prim-act-custom" : ""} buttonBorder`}><span><i className="fa fa-check-square-o"></i></span> {Up} </button>
                                <button type="button" onClick={this.addProfileTrustActionDown} className={`btn btn-outline-danger btn-sm ${(this.props.userVotedDown) ? "btn-dang-act-custom" : ""} buttonBorder`}><span className="pr-1"> <i className="fa fa-exclamation-triangle"></i></span>{Down}</button>
                            </div>
                            <div className="btn-group col-sm-pr-6" role="group" aria-label="Like">
                                <button type="button" onClick={this.addBlogsLikeActionUp} className={`btn btn-outline-primary btn-sm ${(this.props.userLiked) ? "btn-prim-act-custom" : ""} buttonBorder`}> <i className="fa fa-thumbs-up"></i> {Like}</button>
                                <button type="button" onClick={this.addBlogsLikeActionDown} className={`btn btn-outline-danger btn-sm ${(this.props.userDisliked) ? "btn-dang-act-custom" : ""}  rounded-right buttonBorder`}> <i className="fa fa-thumbs-down"></i>{Dislike}</button>
                                <div className="mr-auto col-sm-p-2"> <span className="badge badge-pill badge-white p-2"> <i className="fa fa-eye"></i> {this.props.seen} </span></div>
                                <div className="">  <span className="badge badge-pill badge-white p-2"> <i className="fa fa-comment"></i>  {this.props.numberOfComments} </span></div>
  
                            </div>
                        </div>
                        <AddComment blogsID={this.props.routeProps.match.params.id} />

                        <h5 className="text-secondary"> Comments... </h5>
                        <ListComments blogID={this.props.routeProps.match.params.id} />

                    </div>
                </div>
            </div>
            :
            null; //mogli bi ovde neki 404 stranicu ili <Redirect/>

        return (
            <div>
                {blogContent}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    let seen, numberOfComments, trustVote, userVotedUp, userVotedDown, sbm, likeVote, userLiked, userDisliked;
    if (state.singleBlogMessage && state.singleBlogMessage.statistics) {
        sbm = state.singleBlogMessage;
        seen = sbm.statistics.seen;
        numberOfComments = sbm.statistics.numberOfComments;
        trustVote = sbm.statistics.trustVote;
        userVotedUp = sbm.UserVotedUp;
        userVotedDown = sbm.UserVotedDown;
        likeVote = sbm.statistics.likeVote;
        userLiked = sbm.Like;
        userDisliked = sbm.Dislike;
    }
    return ({
        singleBlogMessage: sbm,
        publicID: state.user.publicID,
        seen: seen,
        numberOfComments: numberOfComments,
        trustVote,
        userVotedUp,
        userVotedDown,
        likeVote,
        userLiked,
        userDisliked,
    })
}

export default connect(mapStateToProps, { getSingleMessageAction, deleteSingleMessageAction, addProfileTrustAction, addBlogsLikeAction })(SingleBlog);

