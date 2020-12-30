import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import useInput from "../input/useInput";

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

const defaultCB = () => {};

export const useModal = ({
  title = "",
  body = "",
  onSubmitOne = defaultCB,
  buttonOneText = "",
  onSubmitTwo = defaultCB,
  buttonTwoText = "",
  label = ""
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [inputValue, inputElement] = useInput({ label });

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmitOne = () => {
    onSubmitOne({ setOpen, inputValue });
  };

  const handleSubmitTwo = () => {
    onSubmitTwo({ setOpen, inputValue });
  };

  const modal = (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <h2 id="transition-modal-title">{title}</h2>

          {body && <p id="transition-modal-description">{body}</p>}

          {label && inputElement}

          {buttonOneText && (
            <button type="button" onClick={handleSubmitOne}>
              {buttonOneText}
            </button>
          )}

          {buttonTwoText && (
            <button type="button" onClick={handleSubmitTwo}>
              {buttonTwoText}
            </button>
          )}
        </div>
      </Fade>
    </Modal>
  );
  return [modal, setOpen];
};
