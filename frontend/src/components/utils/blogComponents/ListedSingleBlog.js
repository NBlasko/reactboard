import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SERVER_BASE_URL } from '../../../store/types/types';
import noPhotosImg from '../../../assets/no-photos.svg';

function ListedSingleBlog(props) {

    const [imageLoadError, setImageLoadError] = useState(true);
    const { message, imageQueryID } = props;
    const { trustVote, likeVote } = message;
    let trustPercent = 50, likePercent = 50;
    if (trustVote && trustVote.number.Up + trustVote.number.Down !== 0) {
        trustPercent = Math.round(
            trustVote.number.Up / (trustVote.number.Up + trustVote.number.Down) * 100
        );
    }
    if (likeVote && likeVote.number.Up + likeVote.number.Down !== 0) {
        likePercent = Math.round(
            likeVote.number.Up / (likeVote.number.Up + likeVote.number.Down) * 100
        );
    }
    let localDate = new Date(message.date).toLocaleString() + "";

    return (
        <div id={message.publicID} className="container-fluid" >
            <div className="row">
                <div className="col-sm-4 col-lg-3 col-xl-2">
                    <Link to={'../blog/' + message.publicID}>
                        {
                            (message.image)
                                ? <img className="img-thumbnail rounded mx-auto d-block"
                                    style={{ maxHeight: "150px", minHeight: "100px" }}
                                    src={
                                        `${SERVER_BASE_URL}api/images/galleryImage`
                                        + `?imageQueryID=${imageQueryID}`
                                        + `&singleImageID=${message.image}` +
                                        `&publicID=${message.authorsPublicID}`
                                    }
                                    onError={(e) => {
                                        if (imageLoadError) {
                                            setImageLoadError(false);
                                            e.target.src = noPhotosImg;
                                        }
                                    }}
                                    alt="loading..."
                                />

                                : <img className="img-thumbnail rounded mx-auto d-block"
                                    style={{ maxHeight: "200px" }}
                                    src={noPhotosImg}
                                    alt="loading..." />
                        }
                    </Link>
                </div>

                <div className="col-sm-8 col-lg-9 col-xl-10">
                    <h4>
                        <Link to={'../blog/' + message.publicID}> {message.title}</Link>
                        <small className="text-muted"> by {message.author} </small>
                    </h4>
                    <p>{message.body}</p>
                    <span className="small pr-3">
                        <i className="fa fa-check-square-o"></i> {trustPercent}%
                    </span>
                    <span className="small pr-3">
                        <i className="fa fa-eye"></i> {message.seen}
                    </span>
                    <span className="small pr-3">
                        <i className="fa fa-thumbs-up"></i> {likePercent}%
                    </span>
                    <span className="small pr-3">
                        <i className="fa fa-comment"></i> {message.numberOfComments}
                    </span>
                    <small className="text-muted"> {localDate.slice(0, -3)} </small>
                </div>
            </div>
            <hr />
        </div >
    )
}

export default ListedSingleBlog;