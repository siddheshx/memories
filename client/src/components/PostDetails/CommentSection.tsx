import React, { useState, useRef } from 'react'
import { Typography, TextField, Button } from "@material-ui/core";
import { useAppDispatch } from '../../app/hooks';

import useStyles from './styles';
import { TPost } from '../../types';
import { commentPostAsync } from '../../slices/posts';

type CommentSectionProps = {
    post: TPost
}

const CommentSection = ({ post }: CommentSectionProps) => {
    // Declarations
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('profile') || '{}');
    const dispatch = useAppDispatch();
    const commentsRef = useRef<any>();

    // States
    const [comments, setComments] = useState<string[]>(post?.comments || []);
    const [comment, setComment] = useState("");

    // Effects


    // Functions
    const handleCommentSubmit = async () => {
        const finalComment = `${user.result.name}: ${comment}`;
        const newComments = await dispatch(commentPostAsync({ comment: finalComment, _id: post._id }))
        setComments(newComments.payload.comments);
        setComment('');

        commentsRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <div>
            <div className={classes.commentsOuterContainer}>
                <div className={classes.commentsInnerContainer}>
                    <Typography gutterBottom variant="h6">Comments</Typography>
                    {comments.map((c, i) => (
                        <Typography key={i} gutterBottom variant="subtitle1">
                            <strong>{c.split(": ")[0]}</strong>
                            {c.split(":")[1]}
                        </Typography>
                    ))}
                    <div ref={commentsRef} />
                </div>
                {user?.result?.name && (
                    <div style={{ width: '70%' }}>
                        <Typography gutterBottom variant="h6">Write a comment</Typography>
                        <TextField
                            fullWidth
                            rows={4}
                            variant="outlined"
                            label="Comment"
                            multiline
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Button
                            style={{ marginTop: '10px' }}
                            fullWidth
                            disabled={!comment}
                            variant="contained"
                            onClick={handleCommentSubmit}
                            color="primary"
                        >
                            Comment
                        </Button>
                    </div>

                )}
            </div>
        </div>
    )
}

export default CommentSection
