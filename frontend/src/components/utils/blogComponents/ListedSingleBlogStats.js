import React, { Fragment } from 'react';
import CardActions from '@material-ui/core/CardActions';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';



const useStyles = makeStyles((theme) => ({
    iconStats: {
        color: "rgba(0, 0, 0, 0.54)"
    },
    textStats: {
        margin: "0 2px"
    },
    iconWrapper: {
        marginRight: "1.5rem",
        display: "flex",
        alignItems: "center"
    },
    shareBtnPosition: {
        marginLeft: "auto"
    }
}));




function ListedSingleBlogStats({ message }) {
    const classes = useStyles();
    const { trustVote, likeVote } = message;

    const generateVote = (voteObj) => {
        let valuePercent = "50";
        if (voteObj && voteObj.number.Up + voteObj.number.Down !== 0) {
            valuePercent = Math.round(
                voteObj.number.Up / (voteObj.number.Up + voteObj.number.Down) * 100
            );
        }
        return valuePercent + "%";
    }


    const customBox = ({ iconComponent, textValue = "" }) => {
        return (
            <Box component="div" className={classes.iconWrapper} >
                {iconComponent}
                <Typography
                    variant="body2"
                    color="textSecondary"
                    component="span"
                    className={classes.textStats}
                >
                    {textValue}
                </Typography>
            </Box>
        )
    }


    return (
        <CardActions disableSpacing>
            
            {[{
                iconComponent: <FavoriteIcon className={classes.iconStats} />,
                textValue: generateVote(trustVote)
            }, {
                iconComponent: <ThumbUpAltIcon className={classes.iconStats} />,
                textValue: generateVote(likeVote)
            }, {
                iconComponent: <VisibilityIcon className={classes.iconStats} />,
                textValue: message.seen
            }, {
                iconComponent: <ChatBubbleIcon className={classes.iconStats} />,
                textValue: message.numberOfComments
            }].map((element, index) =>
                <Fragment key={index}> {customBox(element)}</Fragment>
            )}
       
            <IconButton className={classes.shareBtnPosition}>
                <ShareIcon className={classes.iconStats} />
            </IconButton>


        </CardActions>
    )
}

export default ListedSingleBlogStats;