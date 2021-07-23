import { Container, Grid, Grow } from '@material-ui/core'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getPostsAsync } from '../../slices/posts';
import Form from '../Form/Form'
import Posts from '../Posts/Posts'

import useStyles from "./styles";

const Home = () => {
    const classes = useStyles();
    const [currentId, setCurrentId] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPostsAsync());
    }, [currentId, dispatch]);

    return (
        <Grow in>
            <Container>
                <Grid container className={classes.mainContainer} justifyContent="space-between" alignItems="stretch" spacing={3}>
                    <Grid item xs={12} sm={7}>
                        <Posts setCurrentId={setCurrentId} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Form currentId={currentId} setCurrentId={setCurrentId} />
                    </Grid>
                </Grid>
            </Container>
        </Grow>
    )
}

export default Home
