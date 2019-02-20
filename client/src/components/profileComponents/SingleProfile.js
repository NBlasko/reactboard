import React, { Component } from 'react';
import { connect } from 'react-redux';
import { removeSingleUserAction } from '../../actions';
import ImageGallery from './ImageGallery';
import ProfileData from './ProfileData';
import ProfileMessages from './ProfileMessages'

class SingleProfile extends Component {

    componentWillUnmount() {
        this.props.removeSingleUserAction();
    }


    render() {
        const authorsPublicID = this.props.routeProps.match.params.id;
        console.log(
            "pageQueryID", this.props.pageQueryID,
            "authorsPublicID", authorsPublicID
        )
        return (
            <div className="shadow p-3 m-2 bg-white rounded">
                <ProfileData routeProps={this.props.routeProps} />
                {(this.props.pageQueryID === authorsPublicID) ?
                    <div>
                        <ImageGallery routeProps={this.props.routeProps} />
                        <hr />
                        <ProfileMessages authorsPublicID={authorsPublicID} />
                    </div>
                    :
                    <h1> Loading... </h1>
                }

            </div>
        );
    }
}

const mapStateToProps = (state) => {

    if (state.searchedProfile && state.searchedProfile.coins) {
        return ({
            pageQueryID: state.searchedProfile.coins.pageQueryID
        })
    }

    return ({})
}


export default connect(mapStateToProps, { removeSingleUserAction })(SingleProfile);
