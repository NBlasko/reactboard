import React, { Component } from 'react';
import { connect } from 'react-redux';
import SingleImageInGallery from './SingleImageInGallery'
import {
    getGalleryListAction,
    getNewGalleryListAction,
    removeGalleryListAction
} from '../../store/actions';

import { withRouter } from "react-router";

import ImageUploadClass from './ImageUploadClass';

class ImageGallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numOfImages: -1,
            loading: false,
            emptyAJAX: false,
            matchPath: ''
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if (!this.state.loading && !this.state.emptyAJAX
            && this.props.galleryList && this.props.galleryList[0]) {
            this.setState({ loading: true })   //I wanted two call here on setState
            if (this.props.match.path !== "/addmessage")
                this.props.getGalleryListAction(this.props.galleryList.length);


        }
        if (this.props.match.path === "/addmessage") {
            const l = (
                this.props.galleryList
                && this.props.galleryList.length
            ) ? this.props.galleryList.length : 0
            this.props.getGalleryListAction(l)
        }
    }

    componentDidMount() {
        console.log("this.props Image galery", this.props)
        this.setState({ matchPath: this.props.match.path })
        if (this.props.match.path !== "/addmessage")
            this.props.getNewGalleryListAction(0);
    }

    componentDidUpdate(prevProps, prevState) {
        //   console.log("pre", prevProps.match.url, "sada", this.props)
        if (this.props.match.path !== this.state.matchPath)
            this.setState({ matchPath: this.props.match.path })
        if (prevProps.match.url !== this.props.match.url)
            this.props.getNewGalleryListAction(0)
    }


    componentWillReceiveProps(newProps) {
          console.log("newProps problem", newProps)
        const number = (newProps.number || newProps.number === 0) ? newProps.number : -1;
        if (newProps.galleryList) {

            this.setState({ loading: false, numOfImages: newProps.galleryList.length });
            if ((number >= 0 && number < 5) && newProps.galleryList.length !== -1)
                this.setState({ emptyAJAX: true })
        }

    }

    componentWillUnmount() {
        this.props.removeGalleryListAction();
    }

    render() {

        console.log("this.props.match", this.props)
        // napravi action da dobaci niz slika sa svojim podacima
        // po url param i ako je korisnik koji trazi slike da pogleda ulogovan
        //       console.log("this.props.publicID", this.props.publicID,
        //        "this.props.match", this.props.match)

        const imageGalleryList
            = (this.props.galleryList
                && this.state.matchPath === this.props.match.path
            )
                ? this.props.galleryList.map((singleImage) =>
                    <SingleImageInGallery
                        key={singleImage._id}
                        singleImage={singleImage}
                        {...this.props}
                    />)
                : null;
        return (

            <div >
                {
                    (   /* render everything*/
                        /* if you are viewing your own profile */
                        this.props.publicID === this.props.match.params.id
                        /* or you want to add a message*/
                        || this.props.match.path === `/addmessage`
                    )
                        ?
                        <div>
                            <ImageUploadClass />

                            <hr />
                            <h2 className="text-dark">Image Gallery</h2>
                            <div className="row">

                                {imageGalleryList}

                            </div>
                            {(this.state.emptyAJAX)
                                ? <div> There are no more images... </div>
                                : <button
                                    className="btn btn-primary mt-2"
                                    onClick={this.handleClick}>
                                    Load more images
                             </button>
                            }
                        </div>
                        :
                        null
                }
            </div>

        )

    }
}
const mapStateToProps = (state) => {
    // console.log("state.galleryList", state)

    const number = (state.numberOfData) ? state.numberOfData.number : -1


    let returnedObject = {}


    returnedObject.publicID = state.user.publicID
    returnedObject.number = number;
    if (state.galleryList) returnedObject.galleryList = state.galleryList
    return (returnedObject);
}

const ImageGalleryWithRouter = withRouter(ImageGallery);


export default connect(mapStateToProps, {
    getGalleryListAction,
    getNewGalleryListAction,
    removeGalleryListAction
})(ImageGalleryWithRouter);