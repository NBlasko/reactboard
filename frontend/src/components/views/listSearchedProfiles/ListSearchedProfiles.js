import React, { Component } from 'react';
import { connect } from 'react-redux';
import ListedSingleProfile from './ListedSingleProfile';
import {removeProfilesAction} from '../../../store/actions'

class ListSearchedProfiles extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            numberOfprofiles: -1,
            emptyAJAX: false
        };


    }
    componentDidUpdate(prevProps, prevState) {
        // only update  if the data has changed
        //    console.log("this.props",this.props)
        if (prevProps.location.pathname !== this.props.location.pathname) {
            window.scrollTo(0, 0);
            this.setState({ emptyAJAX: false, numberOfprofiles: -1, });
        }
    }
    componentWillReceiveProps(newProps) {
        if (newProps.location.pathname === this.props.location.pathname) {


            this.setState({ loading: false, numberOfprofiles: newProps.profiles.length });
            if (this.state.numberOfprofiles === newProps.profiles.length && newProps.profiles.length !== -1)
                this.setState({ emptyAJAX: true })
        }
    }

    componentWillUnmount(){
        this.props.removeProfilesAction();
    }

    render() {
        const ProfileList = this.props.profiles.map((profile) =>
            <ListedSingleProfile key={profile.publicID} profile={profile} imageQueryID={this.props.imageQueryID} />);
        return (
            <div className="shadow p-3 m-2 bg-white rounded">
                {
                    ProfileList
                }
                {
                    (this.state.emptyAJAX) ? <div> There are no more profiles... </div> : null
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        profiles: state.profiles,
        imageQueryID: state.user.imageQueryID
    }
}


export default connect(mapStateToProps, {removeProfilesAction})(ListSearchedProfiles);
