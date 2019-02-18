import React, { Component } from 'react';
import { connect } from 'react-redux';
//import {  } from '../../actions';
import ImageGallery from './ImageGallery';
import ProfileData from './ProfileData';
import ProfileMessages from './ProfileMessages'

class SingleProfile extends Component {

    render() {
       
        return (
            <div className="shadow p-3 m-2 bg-white rounded">
                <ProfileData routeProps = {this.props.routeProps}/>
                <ImageGallery routeProps = {this.props.routeProps}/>
                <hr />
                <ProfileMessages authorsPublicID = { this.props.routeProps.match.params.id} />
            </div>
        );
    }
}


export default connect(null, null)(SingleProfile);
