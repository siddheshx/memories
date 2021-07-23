import { CircularProgress, Grid } from '@material-ui/core';
import { SetStateAction } from 'react';
import { Dispatch } from 'react';
import { useAppSelector } from '../../app/hooks';
import Post from './Post/Post';

import useStyles from "./styles";

type PostsProps = {
    setCurrentId: Dispatch<SetStateAction<any>>;
}

const Posts = ({ setCurrentId }: PostsProps) => {
    const classes = useStyles();
    const { posts } = useAppSelector((state) => state.posts);

    return (
        !posts.length ? <CircularProgress /> : (
            <Grid className={classes.mainContainer}
                container
                alignItems="stretch"
                spacing={3}
            >
                {
                    posts.map((post) => (
                        <Grid key={post._id}
                            item
                            xs={12}
                            sm={6}
                        >
                            <Post post={post} setCurrentId={setCurrentId} />
                        </Grid>
                    ))
                }

            </Grid>
        )
    )
}

export default Posts
