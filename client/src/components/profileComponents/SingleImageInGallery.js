import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader/*, ModalBody, ModalFooter*/ } from 'reactstrap';



class SingleImageInGallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }
    render() {
            const closeBtn = <button className="closeImageModalButton" onClick={this.toggle}>&times;</button>;

        return (
            <div className="col-sm-6 col-md-4 col-lg-3">
                <img onClick={this.toggle} className="imageFit" src="https://images.unsplash.com/photo-1543699247-3e2517847993?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2f1cfc406c151200a693c4acc4eae245&auto=format&fit=crop&w=500&q=60" alt="nnn" />
                <Modal className="modal " isOpen={this.state.modal} toggle={this.toggle}>
                <ModalHeader toggle={this.toggle} close={closeBtn}>
                <Button color="primary" onClick={this.toggle}>Select</Button>
                </ModalHeader>
                    <img className="modal-content" src="https://images.unsplash.com/photo-1543699247-3e2517847993?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2f1cfc406c151200a693c4acc4eae245&auto=format&fit=crop&w=500&q=60" alt="nnn" />
                </Modal>
            </div>

        )

    }
}

export default connect(null, null)(SingleImageInGallery);