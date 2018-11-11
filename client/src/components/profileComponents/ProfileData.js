import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSingleUserAction } from '../../actions';
import ImageUploadClass from './ImageUploadClass';
import { Container, Row, Col } from 'reactstrap';
import coinsSVG from '../../assets/coins.svg';

class ProfileData extends Component {

    componentDidMount() {
        this.props.getSingleUserAction(this.props.routeProps.match.params.id);
    }
    render() {
        let name = "", admin = false, trustUp = 0, trustDown = 0, coins = 0, totalTrust;
        const sp = this.props.searchedProfile
        if (sp) {
            admin = sp.admin;
            name = sp.name;
            trustUp = sp.statistics.trustVote.number.Up;
            trustDown = sp.statistics.trustVote.number.Down;
            if (admin) coins = sp.statistics.coins.total;
            totalTrust = Math.round(trustUp / (trustUp + trustDown) * 100) || 50
        }
        return (
            <div>
                <Container>
                    <Row>
                        <Col lg="4" md="6" sm="8" xs="12">
                            <div style={{ maxWidth: "550px"/*, height: "300px"*/ }} className="d-flex justify-content-around">
                                <img src={(sp) ? sp.image.URL : null} alt="nema" className="img-thumbnail img-fluid  " />
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
                                    <ImageUploadClass />
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
    })
}

export default connect(mapStateToProps, { getSingleUserAction })(ProfileData);
