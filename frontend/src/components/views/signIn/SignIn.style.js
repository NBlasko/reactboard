import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
  socialBtnWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    "& span": {
      width: "100%"
    }
  },
  socialBtn: {
    marginBottom: "1rem",
    height: "3rem",
    cursor: "pointer",
    width: "100%"
  },
  facebook: {
    background: "rgb(59, 89, 152)",
    textAlign: "left",
    color: "#e5e5e5",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 2px 2px 0px, rgba(0, 0, 0, 0.24) 0px 0px 1px 0px",
    borderRadius: "2px",
    border: "1px solid transparent",
    fontSize: "14px",
    fontWeight: 500,
    fontFamily: "Roboto, sans-serif",
    "& img": {
      width: "18px",
      height: "18px",
      margin: "auto 22px auto 3px"
    },
    "&:hover": {
      background: "#4267b2"
    }
  },
  google: {
    "& span": {
      textAlign: "left"
    }
  }
});