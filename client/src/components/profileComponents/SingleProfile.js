import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSingleUserAction } from '../../actions';


class SingleProfile extends Component {

    componentDidMount() {
        this.props.getSingleUserAction(this.props.routeProps.match.params.id);
    }
    render() {
        console.log("profile props", this.props)
        let name = "", admin = false, trustUp = 0, trustDown = 0, coins = 0;
        const sp = this.props.searchedProfile
        if (sp) {
            admin = sp.admin;
            name = sp.name;
            trustUp = sp.statistics.trustVote.number.Up;
            trustDown = sp.statistics.trustVote.number.Down;
            if (admin) coins = sp.statistics.coins.total;

        }
        return (
            <div>
                <div> Profile</div>
                <b> {this.props.routeProps.match.params.id} </b>
                <div> name : {name}</div>
                <div> admin: {(admin) ? "jeste" : "nije"}</div>
                <div> coins : {coins}</div>
                <div> trustUp : {trustUp}</div>
                <div> trustDown : {trustDown}</div>

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

export default connect(mapStateToProps, { getSingleUserAction })(SingleProfile);
