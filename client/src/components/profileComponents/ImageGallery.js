import React, { Component } from 'react';
import { connect } from 'react-redux';
import SingleImageInGallery from './SingleImageInGallery'
import { getGalleryListAction, getNewGalleryListAction ,removeGalleryListAction } from '../../actions'
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
        if (!this.state.loading && !this.state.emptyAJAX && this.props.galleryList && this.props.galleryList[0]) {
            this.setState({ loading: true })   //I wanted two call here on setState
            if (this.props.routeProps.match.path !== "/addmessage") this.props.getGalleryListAction(this.props.galleryList.length, this.props.routeProps.match.params.id);


        }
        if (this.props.routeProps.match.path === "/addmessage") {
            const l = (this.props.galleryList && this.props.galleryList.length) ? this.props.galleryList.length : 0
            this.props.getGalleryListAction(l, this.props.publicID)
        }
    }

    componentDidMount() {
        this.setState({ matchPath: this.props.routeProps.match.path })
        if (this.props.routeProps.match.path !== "/addmessage")
            this.props.getNewGalleryListAction(0, this.props.routeProps.match.params.id);
    }

    componentDidUpdate(prevProps, prevState) {
        //   console.log("pre", prevProps.routeProps.match.url, "sada", this.props)
        if (this.props.routeProps.match.path !== this.state.matchPath)
            this.setState({ matchPath: this.props.routeProps.match.path })
        if (prevProps.routeProps.match.url !== this.props.routeProps.match.url)
            this.props.getNewGalleryListAction(0, this.props.routeProps.match.params.id)
    }


    componentWillReceiveProps(newProps) {
        //  console.log("newProps", newProps)
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


        // napravi action da dobaci niz slika sa svojim podacima po url param i ako je korisnik koji trazi slike da pogleda ulogovan

        const imageGalleryList
            = (this.props.galleryList && this.state.matchPath === this.props.routeProps.match.path) ? this.props.galleryList.map((singleImage) =>
                <SingleImageInGallery key={singleImage._id} routeProps={this.props.routeProps} singleImage={singleImage} />)
                : null;
        return (

            <div >
                
                {(this.props.admin) ? <ImageUploadClass /> : null}
                <hr />
                <h2 className = "text-dark">Image Gallery</h2>
                <div className="row">

                    {imageGalleryList}

                </div>
                {(this.state.emptyAJAX) ? <div> There are no more images... </div> :
                    <button className="btn btn-primary mt-2" onClick={this.handleClick}> Load more images </button>
                }
            </div>

        )

    }
}
const mapStateToProps = (state) => {
    // console.log("state.galleryList", state)
    let searchedProfile;

    const number = (state.numberOfData) ? state.numberOfData.number : -1


    let returnedObject = {}

    if (state.searchedProfile && state.searchedProfile) {
        searchedProfile = state.searchedProfile;
        returnedObject = {
            admin: searchedProfile.admin

        }
    }
    returnedObject.publicID = state.user.publicID
    returnedObject.number = number;
    if (state.galleryList) returnedObject.galleryList = state.galleryList
    return (returnedObject);
}
export default connect(mapStateToProps, { getGalleryListAction, getNewGalleryListAction, removeGalleryListAction })(ImageGallery);