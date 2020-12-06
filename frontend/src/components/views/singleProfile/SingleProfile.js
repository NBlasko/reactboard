import React, { Component } from 'react';
import { connect } from 'react-redux';
import { removeSingleUserAction } from '../../../store/actions';
import ImageGallery from '../../utils/imagesComponents/ImageGallery';
import ProfileData from './ProfileData';
import ProfileMessages from './ProfileMessages'

class SingleProfile extends Component {

    componentWillUnmount() {
        this.props.removeSingleUserAction();
    }


    render() {
        const authorsPublicID = this.props.match.params.id;
        console.log(
            "pageQueryID", this.props.pageQueryID,
            "authorsPublicID", authorsPublicID
        )
        return (
            <div className="shadow p-3 m-2 bg-white rounded">
                <ProfileData {...this.props} />
                {(this.props.pageQueryID === authorsPublicID) ?
                    <div>
                        <ImageGallery />
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