import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SERVERURL } from '../../constants';


class ListProfiles extends Component {

    state = {
        imageQueryID: ''
    }
    componentWillReceiveProps(newProps) {
        this.setState({
            imageQueryID: newProps.imageQueryID
          });
    }



    render() {
        console.log("listprofiles props", this.props.routeProps)
        return (
            <div>
                ListProfiles
                <h1>oce li</h1>
                <img src={`${SERVERURL}api/images?imageQueryID=${this.state.imageQueryID || null}&publicID=`} alt= "profile" />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    console.log("s",state.user)
    return {
        imageQueryID: state.user.imageQueryID,
    }
}


export default connect(mapStateToProps,null)(ListProfiles);
