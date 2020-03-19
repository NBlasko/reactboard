import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { SERVERURL } from '../../../store/types/types';
import {
    updatePreviewBlogImageAction,
    setProfileImageAction,
    setBlogImageAction
} from '../../../store/actions'
import axios from "axios";

class SingleImageInGallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            nestedModal: false,
            closeAll: false,
            refresh: 0,
            matchId: ""
        };
        this.galleryPath = this.galleryPath.bind(this);
        this.toggle = this.toggle.bind(this);
        this.toggleNested = this.toggleNested.bind(this);
        this.toggleAll = this.toggleAll.bind(this);
        this.nestedModal = this.nestedModal.bind(this);
        this.deleteAsAdmin = this.deleteAsAdmin.bind(this);
        this.setProfileImage = this.setProfileImage.bind(this);
        this.setBlogImage = this.setBlogImage.bind(this);
    }
    componentDidMount() {
        this.setState({
            matchId: this.props.match.params.id
            // Important, If I use props directly instead of state in img url, the <img /> tag will try to fetch images from previous profile
        })
    }

    galleryPath(namePath) {
        switch (namePath) {

            case "/singleprofile/:id":
                return <Button
                    color="secondary"
                    onClick={this.setProfileImage}>
                    Select as profile image
                      </Button>

            case "/addmessage":
                return <Button color="secondary"
                    onClick={this.setBlogImage}>
                    Select as blog image
                     </Button>

            default:
                return null
        }
    }

    deleteAsAdmin() {
        console.log("this.props", this.props.singleImage._id)
        //  return;
        axios({
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.reactBoardToken}`,
                'Cache-Control': 'no-cache'
            },
            url: SERVERURL + 'api/images/galleryImage/' + this.props.singleImage._id
        }).then(res => {
            this.props.setGallery(gallery => {
                return gallery.filter(singleImage => singleImage._id !== res.data.id)
            })
            this.props.updatePreviewBlogImageAction(res.data.id);
            this.toggleAll();

        }).catch(error => {
            console.log(error)
            this.toggleAll();
        });
    }


    setProfileImage() {
        this.props.setProfileImageAction({ id: this.props.singleImage._id })
        this.toggle();
    }

    setBlogImage() {
        this.props.setBlogImageAction({ id: this.props.singleImage._id })
        this.toggle();
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    toggleNested() {
        this.setState({
            nestedModal: !this.state.nestedModal,
            closeAll: false
        });
    }

    toggleAll() {
        this.setState({
            nestedModal: !this.state.nestedModal,
            closeAll: true
        });
    }

    nestedModal() {

        return <span>
            <Button color="secondary" onClick={this.toggleNested}>Delete image</Button>
            <Modal isOpen={this.state.nestedModal} toggle={this.toggleNested} onClosed={this.state.closeAll ? this.toggle : undefined}>
                <ModalHeader>Delete image</ModalHeader>
                <ModalBody>Are you sure?</ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={this.deleteAsAdmin}>Delete</Button>{' '}
                    <Button color="secondary" onClick={this.toggleAll}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </span>

    }

    render() {
        const closeBtn = <Button color="danger" onClick={this.toggle}>&times;</Button>;

        const publicIdToGetImage = (this.props.match.path === "/addmessage") ? this.props.publicID : this.state.matchId;
        return (
            <div className="col-sm-6 col-md-4 col-lg-3" style={{ border: "1px solid #ddd", padding: "5px" }}>
                <img onClick={this.toggle} className="imageFit"
                    src={`${SERVERURL}api/images/galleryImage?imageQueryID=${this.props.imageQueryID}&singleImageID=${this.props.singleImage._id}&publicID=${publicIdToGetImage}&refreshID=${this.state.refresh}`}
                    alt="loading..." />
                <Modal isOpen={this.state.modal} className={this.props.className} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle} close={closeBtn}>
                        {this.galleryPath(this.props.match.path)}
                        {this.nestedModal()}
                    </ModalHeader>
                    <img className="modal-content"
                        src={`${SERVERURL}api/images/galleryImage?imageQueryID=${this.props.imageQueryID}&singleImageID=${this.props.singleImage._id}&publicID=${publicIdToGetImage}&refreshID=${this.state.refresh}`}
                        alt="loading..." />
                </Modal>
            </div>

        )

    }
}

const mapStateToProps = (state) => {
    return {
        imageQueryID: state.user.imageQueryID,
        publicID: state.user.publicID
    }
}
export default connect(mapStateToProps, {
    setProfileImageAction,
    setBlogImageAction,
    updatePreviewBlogImageAction
})(SingleImageInGallery);