import React, { useState } from 'react';
import { TPost } from '../../../types';
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from "@material-ui/core";
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import moment from 'moment';
import { useHistory } from "react-router-dom";

import useStyles from "./styles";
import { Dispatch } from 'react';
import { SetStateAction } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { clearPost, deletePostAsync, likePostAsync } from '../../../slices/posts';
import { ThumbUpAltOutlined } from '@material-ui/icons';

type PostProps = {
    post: TPost,
    setCurrentId: Dispatch<SetStateAction<any>>;
}

const Post = ({ post, setCurrentId }: PostProps) => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const user = JSON.parse(localStorage.getItem('profile') || '{}');
    const history = useHistory();
    const [likes, setLikes] = useState(post?.likes)

    const openPost = () => {
        dispatch(clearPost());
        history.push(`/posts/${post._id}`);
    }

    const userId = user?.result?.googleId || user?.result?._id;
    const hasLikedPost = likes?.find((like) => like === (userId));

    const handleLikeClick = () => {
        dispatch(likePostAsync(post._id));
        if(hasLikedPost){
            setLikes(likes?.filter((id) => id !== (userId)));
        }else{
            if(likes)
                setLikes([...likes, userId]);
            else
                setLikes([userId]);
        }
    }

    const Likes = () => {
        if (likes && likes.length > 0) {
            return likes.find((like) => like === (userId))
                ? (
                    <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}`}</>
                ) : (
                    <><ThumbUpAltOutlined fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</>
                );
        }

        return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
    };

    return (
        <Card className={classes.card} raised elevation={6} >
            <div
                style={{ cursor: 'pointer' }}
                onClick={openPost}
            >
                <CardMedia className={classes.media} image={post.selectedFile} title={post.title} />
                <div className={classes.overlay}>
                    <Typography variant="h6">{post.name}</Typography>
                    <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
                </div>
                {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
                    <div className={classes.overlay2}>
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentId(post._id);
                            }}
                            style={{ color: 'white' }}
                            size="small"
                        >
                            <MoreHorizIcon fontSize="medium" />
                        </Button>
                    </div>
                )}
                <div className={classes.details}>
                    <Typography variant="body2" color="textSecondary">{post.tags ? post.tags.map((tag) => `#${tag} `) : ''}</Typography>
                </div>
                <Typography className={classes.title} variant="h5" gutterBottom>{post.title}</Typography>
                <CardContent className={classes.cardContentH}>
                    <Typography variant="body2" color="textSecondary" component="p">{post.message}</Typography>
                </CardContent>
            </div>
            <CardActions className={classes.cardActions} >
                <Button size="small" color="primary" disabled={!user?.result} onClick={handleLikeClick}>
                    <Likes />
                </Button>
                {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
                    <Button size="small" color="primary" onClick={() => dispatch(deletePostAsync(post._id))}>
                        <DeleteIcon fontSize="small" />
                        Delete
                    </Button>
                )}
            </CardActions>
        </Card>
    )
}

export default Post
