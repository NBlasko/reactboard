import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSingleUserAction } from '../../store/actions'

import { Container, Row, Col } from 'reactstrap';
import coinsSVG from '../../assets/coins.svg';
import profileImg from '../../assets/profile.svg';
import { SERVERURL } from '../../constants';
class ProfileData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageQueryID: '',
            refresh: 0,   //to refresh url get method
            imageLoadError: true
        }
    }


    componentWillReceiveProps(newProps) {
        if (this.state.imageQueryID !== newProps.imageQueryID)
            this.setState({
                imageQueryID: newProps.imageQueryID
            });
        if (this.state.refresh !== newProps.refresh)
            this.setState({
                refresh: newProps.refresh
            });
    }



    componentDidMount() {
        this.props.getSingleUserAction(this.props.match.params.id);
    }
    componentDidUpdate(prevProps) {

        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.setState({ imageLoadError: true });
            this.props.getSingleUserAction(this.props.match.params.id);
        }
    }






    render() {
        let name = "", admin = false, trustUp = 0, trustDown = 0, coins = 0, totalTrust = 50;
        const sp = this.props.searchedProfile;
        if (sp) {
            admin = sp.admin;
            name = sp.name;
            trustUp = sp.trustVote.number.Up;
            trustDown = sp.trustVote.number.Down;
            if (admin) coins = sp.coins.total;
            if (trustUp + trustDown)
                totalTrust = Math.round(trustUp / (trustUp + trustDown) * 100)
        }

        return (
            <div>
                <Container>
                    <Row>
                        <Col lg="4" md="6" sm="8" xs="12">
                            <div style={{ maxWidth: "550px" }} className="justify-content-around" >
                                {(this.state.imageQueryID) ?
                                    <img style={{ border: "none" }} src={`${SERVERURL}api/images?imageQueryID=${this.state.imageQueryID}&publicID=${this.props.match.params.id}&refreshID=${this.state.refresh}`}
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
                                        className="imageFit " />
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
                                <div className="mb-3">
                                    <img style={{ width: 35, height: 35 }} src={coinsSVG} alt="coins" /> {coins}
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
    if (state.searchedProfile) {
        searchedProfile = state.searchedProfile;
    }
    return ({
        searchedProfile,
        imageQueryID: state.user.imageQueryID,
        refresh: state.refresh
    })
}

export default connect(mapStateToProps, { getSingleUserAction })(ProfileData);
