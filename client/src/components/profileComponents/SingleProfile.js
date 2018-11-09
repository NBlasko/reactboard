import React, { Component } from 'react';
import { connect } from 'react-redux';
//import {  } from '../../actions';
import ProfileData from './ProfileData';
import ProfileMessages from './ProfileMessages'
class SingleProfile extends Component {

   
    render() {
       
        return (
            <div>
                <div> Profile</div>
                <ProfileData routeProps = {this.props.routeProps}/>
                <hr />
                <ProfileMessages authorsPublicID = { this.props.routeProps.match.params.id} />
            </div>
        );
    }
}


export default connect(null, null)(SingleProfile);
