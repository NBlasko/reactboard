import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteMessageAction } from '../../actions'
import { Link } from 'react-router-dom';
import { SERVERURL } from '../../constants';
import profileImg from '../../assets/profile.svg';

class ListedSingleProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            imageLoadError: true
        }
    }


    render() {
        const { profile } = this.props;
        const { trustVote } = profile;
        let trustPercent = 50;
        if (trustVote && trustVote.Up + trustVote.Down !== 0) {
            trustPercent = Math.round(trustVote.Up / (trustVote.Up + trustVote.Down) * 100);
        }


        return (
            <div id={profile.publicID} className="container-fluid" >
                <div className="row">

                    <div className="col-sm-4 col-lg-3 col-xl-2">
                        <Link to={'../singleprofile/' + profile.publicID}>
                        {(this.props.imageQueryID) ?
                                <img style={{ border: "none" }} src={`${SERVERURL}api/images?imageQueryID=${this.props.imageQueryID}&publicID=${this.props.profile.publicID}`}
                                    alt="nema"
                                    onError={(e) => {
                                        if (this.state.imageLoadError) {
                                            this.setState({
                                                imageLoadError: false
                                            });
                                            e.target.src = profileImg;
                                        }
                                    }
                                    }
                                    className="img-thumbnail img-fluid mx-auto d-block " />
                                : null}
                        </Link>
                    </div>

                    <div>
                        <h4><Link to={'../singleprofile/' + profile.publicID}> {profile.name}</Link></h4>
                        <span className="small pr-3"> <i className="fa fa-check-square-o"></i> {trustPercent}% </span>
                        {// u komentar dok ne sredim dugme za brisanje   <button className="btn btn-danger" id={message.publicID} onClick={this.handleClick} > &times; </button>
                        }

                    </div>
                </div>
                <hr />
            </div >

        )

    }
}

export default connect(null, { deleteMessageAction })(ListedSingleProfile);