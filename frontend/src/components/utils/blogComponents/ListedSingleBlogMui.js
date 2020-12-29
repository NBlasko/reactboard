import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import ListedSingleBlogStats from "./ListedSingleBlogStats";
import { Link } from "react-router-dom";
import { SERVER_BASE_URL } from "../../../store/types/types";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 600,
    margin: "0.5rem auto"
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9,
    backgroundColor: "grey"
  },
  avatar: {
    backgroundColor: "red"
  },
  iconStats: {
    "&:hover": {
      backgroundColor: "transparent",
      cursor: "initial"
    },
    "&:active": {
      backgroundColor: "transparent",
      cursor: "initial"
    }
  },
  textStats: {
    margin: "0 2px"
  },
  linkStyle: {
    textDecoration: "none"
  }
}));

function ListedSingleBlog(props) {
  const classes = useStyles();
  const { message, imageQueryID } = props;

  let localDate = new Date(message.date).toLocaleString() + "";

  return (
    <div id={message.publicID}>
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              R
            </Avatar>
          }
          title={message.author}
          subheader={localDate}
        />

        {message.image ? (
          <Link to={"../blog/" + message.publicID}>
            <CardMedia
              className={classes.media}
              image={
                `${SERVER_BASE_URL}api/images/galleryImage` +
                `?imageQueryID=${imageQueryID}` +
                `&singleImageID=${message.image}` +
                `&publicID=${message.authorsPublicID}`
              }
              title={message.title}
            />
          </Link>
        ) : null}

        <CardContent>
          <Link to={"blog/" + message.publicID} className={classes.linkStyle}>
            <Typography variant="body1" color="textPrimary" component="p">
              {message.title}
            </Typography>
          </Link>

          <Typography variant="body2" color="textSecondary" component="p">
            {message.body}
          </Typography>
        </CardContent>
        <ListedSingleBlogStats message={message} />
      </Card>
    </div>
  );
}

export default ListedSingleBlog;
