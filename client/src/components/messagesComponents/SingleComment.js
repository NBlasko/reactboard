import React, { Component } from 'react';
import { connect } from 'react-redux';
import profileImg from '../../assets/profile.svg';
import { SERVERURL } from '../../constants';
import { Link } from 'react-router-dom';


class SingleComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageLoadError: true
        }
    }

    render() {
        const { message } = this.props;

        let localDate = new Date(message.date).toLocaleString() + "";

        return (
            <div style={{ maxHeight: "300px" }}>
                <hr />
                <div id={message._id} className="row" >

                    <div className="col-sm-4 col-lg-3 col-xl-2">
                        <Link to={`/singleprofile/${this.props.message.authorsPublicID}`}>
                            <img className="img-thumbnail img-fluid d-block "
                                style={{ maxHeight: "150px", minHeight: "100px" }}
                                src={`${SERVERURL}api/images`
                                    + `?imageQueryID=${this.props.imageQueryID}`
                                    + `&publicID=${this.props.message.authorsPublicID}`}
                                alt="nema"
                                onError={
                                    (e) => {
                                        if (this.state.imageLoadError) {
                                            this.setState({
                                                imageLoadError: false
                                            });
                                            e.target.src = profileImg;
                                        }
                                    }
                                }
                            />
                        </Link>
                    </div>
                    <div className="col-sm-8 col-lg-9 col-xl-10">
                        <div>
                            <Link to={
                                `/singleprofile/${this.props.message.authorsPublicID}`
                            }>
                                <b>{message.author}</b>
                            </Link>
                            , <small className="text-muted"> {localDate.slice(0, -3)} </small>
                        </div>
                        <div>
                            {message.body}
                        </div>
                    </div>

                </div>

            </div>


        )

    }
}

const mapStateToProps = (state) => {
    return ({
        imageQueryID: state.user.imageQueryID,
    })
}


export default connect(mapStateToProps, null)(SingleComment);