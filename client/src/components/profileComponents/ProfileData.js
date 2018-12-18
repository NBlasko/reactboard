import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSingleUserAction } from '../../actions';
import axios from 'axios'
import { Container, Row, Col, Button, Alert } from 'reactstrap';
import coinsSVG from '../../assets/coins.svg';
import profileImg from '../../assets/profile.svg';
import { SERVERURL } from '../../constants';
class ProfileData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageQueryID: '',
            file: null,
            errorMessage: '',
            progressMessage: '',
            refresh: 0,   //to refresh url get method
            imageLoadError: true
        }

        this.fileSelected = this.fileSelected.bind(this);
        this.fileUploadButton = this.fileUploadButton.bind(this);
        this.fileUpload = this.fileUpload.bind(this);

    }


    componentWillReceiveProps(newProps) {
        this.setState({
            imageQueryID: newProps.imageQueryID
        });
    }



    componentDidMount() {
        this.props.getSingleUserAction(this.props.routeProps.match.params.id);
    }


    fileSelected(e) {
        //   console.log("e", e.target.files[0])
        this.setState({ file: e.target.files[0] })
    }

    fileUploadButton() { this.fileInput.click() }
    fileUpload() {

        if (this.state.file) {
            let fd = new FormData();
            fd.append('image', this.state.file, this.state.file.name)
            axios({
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.reactBoardToken}`,
                    'Cache-Control': 'no-cache'
                },

           //     url: SERVERURL + 'api/images',
                url: 'http://localhost:3001/api/images/gallery',
                data: fd,
                onUploadProgress: (e) => {
                    this.setState({ progressMessage: Math.round(e.loaded / e.total * 100) })
                }
            })
                .then(res => {

                    this.setState({ file: null, progressMessage: '', refresh: new Date().getTime() })
                })
                .catch(err => {
                    this.setState({ file: null, progressMessage: '' })
                    console.log("error", err)
                    //handle errorMessage
                })
        }
    }



    render() {
        let name = "", admin = false, trustUp = 0, trustDown = 0, coins = 0, totalTrust;
        const sp = this.props.searchedProfile;
        if (sp) {
            admin = sp.admin;
            name = sp.name;
            trustUp = sp.statistics.trustVote.number.Up;
            trustDown = sp.statistics.trustVote.number.Down;
            if (admin) coins = sp.statistics.coins.total;
            totalTrust = Math.round(trustUp / (trustUp + trustDown) * 100) || 50
        }
        const pm = this.state.progressMessage;
        let progressMessage = (pm !== '') ?
            <div>
                <h6> Image is loading... </h6>
                <div className="progress">
                    <div className="progress-bar  bg-primary" role="progressbar" style={{ width: `${pm - 1}%` }} aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
                    <div className="progress-bar bg-light" role="progressbar" style={{ width: `${101 - pm}%` }} aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
            : null;

        let errorMessage = (this.state.errorMessage !== '') ? <Alert color="warning opacity-5">{this.state.errorMessage}</Alert> : null;
        //className="d-flex justify-content-around"
        console.log("statettt", this.state.imageQueryID, this.props.routeProps.match.params.id, this.state.refresh)
        return (
            <div>
                <Container>
                    <Row>
                        <Col lg="4" md="6" sm="8" xs="12">
                            <div style={{ maxWidth: "550px" }} className="justify-content-around" >
                                {(this.state.imageQueryID) ?
                                    <img style={{ border: "none" }} src={`${SERVERURL}api/images?imageQueryID=${this.state.imageQueryID}&publicID=${this.props.routeProps.match.params.id}&refreshID=${this.state.refresh}`}
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
                            </div>
                        </Col>

                        <Col lg="8" md="6" sm="4" xs="12">

                            <h2 className="d-flex justify-content-around">  {name}</h2>

                            <div className="d-flex justify-content-between">
                                <span className="small pr-3"> <i className="fa fa-check-square-o"></i> {trustUp} % </span>
                                <span className="small pr-3"> <i className="fa fa-exclamation-triangle"></i> {trustDown} % </span>
                            </div>
                            <div className="progress">
                                <div className="progress-bar  bg-primary" role="progressbar" style={{ width: `${totalTrust}%` }} aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
                                <div className="progress-bar bg-danger" role="progressbar" style={{ width: `${100 - totalTrust}%` }} aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                            <div className="mt-3">  {(admin) ?
                                <div>
                                    <div className="mb-3"> <img style={{ width: 35, height: 35 }} src={coinsSVG} alt="coins" /> {coins}</div>
                                    <div>
                                        <br />
                                        <input type="file" ref={fileInput => this.fileInput = fileInput} style={{ display: "none" }} onChange={this.fileSelected} />
                                        <Button color="dark" className="m-3" onClick={() => this.fileInput.click()} > Select image </Button>
                                        {(this.state.file && !pm) ? <Button color="dark" className="m-3" onClick={this.fileUpload} > Upload </Button> : null}
                                        {(pm) ? progressMessage : null}


                                        {errorMessage}
                                    </div>
                                </div>
                                : null}
                            </div>

                        </Col>
                    </Row>

                </Container>


            </div>
        );
    }
}

const mapStateToProps = (state) => {
    let searchedProfile;
    if (state.searchedProfile && state.searchedProfile.statistics) {
        searchedProfile = state.searchedProfile;
    }
    return ({
        searchedProfile,
        imageQueryID: state.user.imageQueryID,
    })
}

export default connect(mapStateToProps, { getSingleUserAction })(ProfileData);
