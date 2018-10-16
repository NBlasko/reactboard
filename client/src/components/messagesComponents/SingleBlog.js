import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSingleMessageAction, deleteSingleMessageAction } from '../../actions';
import ListComments from './ListComments';
import AddComment from './AddComment';

class SingleBlog extends Component {

    componentDidMount() {
        console.log("ccomponentDidMount",this.props.routeProps.match.params.id)
        this.props.getSingleMessageAction(this.props.routeProps.match.params.id);
    }
    componentWillUnmount() {
   //     console.log("componentWillUnmount")
        this.props.deleteSingleMessageAction();
    }
    componentDidUpdate() {

        console.log("Single Blog uslovni update")

    }
    render() {
         const blogContent = (this.props.singleBlogMessage) ?
            <div>
                <div className="card border-light mb-3" >
                    <div className="card-body">
                        <h5 className="card-title text-dark">{this.props.singleBlogMessage.title} <i>by {this.props.singleBlogMessage.author}</i></h5>
                        <p className="card-text">{this.props.singleBlogMessage.body}</p>

                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-p-2"> <span className="badge badge-pill badge-primary p-2 "> <i className="fa fa-check-square-o"></i> trusted 37%</span> </div>
                                <div className="col-sm-p-2"> <span className="badge badge-pill badge-danger p-2"> <i className="fa fa-eye"></i> seen 67 times</span></div>
                                <div className="col-sm-p-2">  <span className="badge badge-pill badge-success p-2"> <i className="fa fa-thumbs-up"></i> liked 47%</span></div>
                                <div className="col-sm-p-2">  <span className="badge badge-pill badge-warning p-2"> <i className="fa fa-comment"></i> comments 208 </span></div>
                                <div className="ml-auto col-sm-p-2">{(this.props.singleBlogMessage.authorsPublicID === this.props.publicID) ? <button className="btn btn-danger" type="button">Delete</button> : null}</div>

                            </div>
                        </div>   
                            <AddComment  blogsID = {this.props.routeProps.match.params.id} />
                            <hr />
                            comments...
                            <ListComments blogID = {this.props.routeProps.match.params.id}/>
                        
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
  //  console.log("st", state)
    return ({
        singleBlogMessage: state.singleBlogMessage,
        publicID: state.user.publicID,
    })
}

export default connect(mapStateToProps, { getSingleMessageAction, deleteSingleMessageAction })(SingleBlog);

