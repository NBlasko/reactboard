import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCommentsAction,getNewCommentsAction,  deleteAllCommentsAction } from '../../actions'
import SingleComment from './SingleComment';
class ListComments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            skip: 0,
            loading: true,
            numberOfcomments: 0,
            emptyAJAX: false
        };
        this.handleScroll = this.handleScroll.bind(this);

    }
    componentDidMount() {
        this.props.getNewCommentsAction(this.props.blogID, 0, this.props.coinQueryID);
        window.addEventListener('scroll', this.handleScroll);
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
        this.props.deleteAllCommentsAction();
    }

    componentWillReceiveProps(newProps) {

        if (newProps.comments !== this.props.comments) {
            this.setState((previousState) => {
                return { skip: previousState.skip + 5 };
            });  
        }

        this.setState({
            loading: false, numberOfcomments: newProps.comments.length
        });
        if (this.state.numberOfcomments === newProps.comments.length)
            this.setState({ emptyAJAX: true })
    }

    handleScroll(e) {
        if (!this.state.loading && !this.state.emptyAJAX) {
            const lastDiv = document.getElementById(this.props.comments[this.props.comments.length - 1]._id)
            const lastDivOffset = lastDiv.offsetTop + lastDiv.clientHeight;
            const pageOffset = window.pageYOffset + window.innerHeight;
            const bottomOffset = 20;
            if (pageOffset > lastDivOffset - bottomOffset) {
                this.setState({ loading: true })   //I wanted two call here on setState
                this.props.getCommentsAction(this.props.blogID, this.state.skip, this.props.coinQueryID);
               
            }
        }
    }


    render() {
        const commentList = this.props.comments.map((comment) =>
            <SingleComment key={comment._id} message={comment} />);
        //sada je ok da koristim comment._id, jer i ako ga ostali znaju ne mogu stetu da nacine
        // mislim da mi nije potreban ni publicBlogID, on nema veze sa jwt, zato cu ga obrisati prvom prilikom
        return (
            <div>
                {commentList}
                {(this.state.emptyAJAX) ? <div> There are no more comments... </div> : null}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const {coins }= state.singleBlogMessage;
    const result = {
        comments: state.comments,
    }
    if (coins) {
        result.coinQueryID = coins.coinQueryID;
        result.pageQueryID = coins.pageQueryID;
     }
    return result
}

export default connect(mapStateToProps, { getCommentsAction, deleteAllCommentsAction, getNewCommentsAction })(ListComments);