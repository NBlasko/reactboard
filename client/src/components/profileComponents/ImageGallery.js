import React, { Component } from 'react';
import { connect } from 'react-redux';
import SingleImageInGallery from './SingleImageInGallery'



class ImageGallery extends Component {
    //   constructor(props) {
    //      super(props);
    //    this.handleClick = this.handleClick.bind(this);
    //   }

    //  handleClick(e) {
    //      this.props.deleteMessageAction(e.target.id);
    //  }
    render() {


        return (
            <div >
                Ajde Galerija
                <div className="row">
                    <SingleImageInGallery/>
                    <SingleImageInGallery/>
                    <SingleImageInGallery/>
                    <SingleImageInGallery/>
                    <SingleImageInGallery/>
                   
                </div>

            </div>

        )

    }
}

export default connect(null, null)(ImageGallery);