import React, { Component } from 'react';
import { connect } from 'react-redux';
import profileImg from '../../assets/profile.svg';
import { SERVERURL } from '../../constants';
import { Link } from 'react-router-dom';


class SingleComment extends Component {
    constructor(props) {
        super(props);
        //    this.handleClick = this.handleClick.bind(this);

        this.state = {
            imageLoadError: true
        }
    }

    //  handleClick(e) {
    //      this.props.deleteMessageAction(e.target.id);
    //  }
    render() {
        const { message } = this.props;



        let localDate = new Date(message.date).toLocaleString() + "";
        // const vreme = new Date() ;
        //  const iso  =  vreme.toISOString();
        //sad znam kako da brojim coins, mislim ...
        //  const opet= new Date(iso);
        //  console.log("vreme", vreme, iso, opet);

        //koristi message._id za iinfinite scroll ili query selector
   //     console.log("single comment props", this.props)
        return (
            <div style={{ maxHeight: "300px" }}>
                <hr />
                <div id={message._id} className="row" >

                    <div className="col-sm-4 col-lg-3 col-xl-2">
                        <Link to={`/singleprofile/${this.props.message.authorsPublicID}`}>
                            <img style={{ border: "none" }} src={`${SERVERURL}api/images?imageQueryID=${this.props.imageQueryID}&publicID=${this.props.message.authorsPublicID}`}
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
                                className="img-thumbnail img-fluid d-block " />
                        </Link>
                    </div>
                    <div className="col-sm-8 col-lg-9 col-xl-10">
                        <div>
                            <Link to={`/singleprofile/${this.props.message.authorsPublicID}`}>
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