import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSingleMessageAction, deleteSingleMessageAction } from '../../actions';
import ListComments from './ListComments';
import AddComment from './AddComment';

class SingleBlog extends Component {

    componentDidMount() {
        console.log("ccomponentDidMount", this.props.routeProps.match.params.id)
        this.props.getSingleMessageAction(this.props.routeProps.match.params.id);
    }
    componentWillUnmount() {
        //     console.log("componentWillUnmount")
        this.props.deleteSingleMessageAction();
    }

    render() {
        const blogContent = (this.props.singleBlogMessage) ?
            <div className="shadow-lg p-3 m-2 bg-white rounded">
                <div className="card border-white mb-3" >
                    <div className="card-body">
                        <h5 className="card-title text-dark">{this.props.singleBlogMessage.title} <i>by {this.props.singleBlogMessage.author}</i></h5>
                        <p className="card-text">{this.props.singleBlogMessage.body}</p>

                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-p-2"> <span className="badge badge-pill badge-primary p-2 "> <i className="fa fa-check-square-o"></i> trusted 37%</span> </div>
                                <div className="col-sm-p-2"> <span className="badge badge-pill badge-danger p-2"> <i className="fa fa-eye"></i> seen {this.props.seen} times</span></div>
                                <div className="col-sm-p-2">  <span className="badge badge-pill badge-success p-2"> <i className="fa fa-thumbs-up"></i> <span className=" mr-2">4756</span> <i className="fa fa-thumbs-down"></i>   2</span></div>
                                <div className="col-sm-p-2">  <span className="badge badge-pill badge-warning p-2"> <i className="fa fa-comment"></i> comments {this.props.numberOfComments} </span></div>
                                <div className="ml-auto col-sm-p-2">{(this.props.singleBlogMessage.authorsPublicID === this.props.publicID) ? <button className="btn btn-danger" type="button">Delete</button> : null}</div>

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
    console.log("st", state.singleBlogMessage)
    let seen, numberOfComments;
    if (state.singleBlogMessage && state.singleBlogMessage.statistics) {
        seen = state.singleBlogMessage.statistics.seen;
        numberOfComments = state.singleBlogMessage.statistics.numberOfComments;
    }
    return ({
        singleBlogMessage: state.singleBlogMessage,
        publicID: state.user.publicID,
        seen: seen,
        numberOfComments: numberOfComments,
    })
}

export default connect(mapStateToProps, { getSingleMessageAction, deleteSingleMessageAction })(SingleBlog);

