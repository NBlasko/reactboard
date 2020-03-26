import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { SERVERURL } from '../../../store/types/types';
import {
    updatePreviewBlogImageAction,
    setProfileImageAction,
    setBlogImageAction
} from '../../../store/actions'
import axios from "axios";

function SingleImageInGallery(props) {

    const imageQueryID = useSelector(state =>
        state.user.imageQueryID
    )

    const publicID = useSelector(state =>
        state.user.publicID
    )

    const dispatch = useDispatch();

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isOpenNestedModal, setIsOpenNestedModal] = useState(false);
    const [closeAll, setCloseAll] = useState(false);
    const [refreshImg, setRefreshImg] = useState(0);
    const [matchId, setMatchId] = useState("");


    useEffect(() => {
        setMatchId(props.match.params.id)
    }, [])


    const galleryPath = (namePath) => {
        switch (namePath) {

            case "/singleprofile/:id":
                return <Button
                    color="secondary"
                    onClick={setProfileImage}>
                    Select as profile image
                      </Button>

            case "/addmessage":
                return <Button color="secondary"
                    onClick={setBlogImage}>
                    Select as blog image
                     </Button>

            default:
                return null
        }
    }

    const deleteAsAdmin = () => {
        axios({
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.reactBoardToken}`,
                'Cache-Control': 'no-cache'
            },
            url: SERVERURL + 'api/images/galleryImage/' + props.singleImage._id
        }).then(res => {
            props.setGallery(gallery => {
                return gallery.filter(singleImage => singleImage._id !== res.data.id)
            })
            dispatch(updatePreviewBlogImageAction(res.data.id));

        }).catch(error => {
            console.log(error)
            toggleAll();
        });
    }


    const setProfileImage = () => {
        dispatch(setProfileImageAction({ id: props.singleImage._id }))
        toggle();
    }

    const setBlogImage = () => {
        dispatch(setBlogImageAction({ id: props.singleImage._id }))
        toggle();
    }

    const toggle = () => {
        setIsOpenModal(prevState => !prevState);
    }

    const toggleNested = () => {
        setIsOpenNestedModal(prevState => !prevState);
        setCloseAll(false);
    }

    const toggleAll = () => {
        setIsOpenNestedModal(prevState => !prevState);
        setCloseAll(true);
    }

    const nestedModal = () => {

        return <span>
            <Button color="secondary" onClick={toggleNested}>Delete image</Button>
            <Modal
                isOpen={isOpenNestedModal}
                toggle={toggleNested}
                onClosed={
                    closeAll
                        ? toggle
                        : undefined
                }
            >
                <ModalHeader>Delete image</ModalHeader>
                <ModalBody>Are you sure?</ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={deleteAsAdmin}>Delete</Button>{' '}
                    <Button color="secondary" onClick={toggleAll}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </span>

    }


    const closeBtn =
        <Button color="danger" onClick={toggle}>
            &times;
        </Button>;

    const publicIdToGetImage
        = (props.match.path === "/addmessage")
            ? publicID
            : matchId;

    return (
        <div
            className="col-sm-6 col-md-4 col-lg-3"
            style={{ border: "1px solid #ddd", padding: "5px" }}
        >
            <img
                onClick={toggle}
                className="imageFit"
                src={`${SERVERURL}api/images/galleryImage?imageQueryID=${imageQueryID}&singleImageID=${props.singleImage._id}&publicID=${publicIdToGetImage}&refreshID=${refreshImg}`}
                alt="loading..."
            />

            <Modal
                isOpen={isOpenModal}
                className={props.className}
                toggle={toggle}
            >
                <ModalHeader
                    toggle={toggle}
                    close={closeBtn}
                >
                    {galleryPath(props.match.path)}
                    {nestedModal()}
                </ModalHeader>
                <img
                    className="modal-content"
                    src={`${SERVERURL}api/images/galleryImage?imageQueryID=${imageQueryID}&singleImageID=${props.singleImage._id}&publicID=${publicIdToGetImage}&refreshID=${refreshImg}`}
                    alt="loading..."
                />
            </Modal>
        </div>

    )


}


export default SingleImageInGallery;