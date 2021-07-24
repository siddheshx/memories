import { Container, Grid, Grow, Paper, AppBar, TextField, Button } from '@material-ui/core'
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getPostsBySearchAsync } from '../../slices/posts';
import { useHistory, useLocation } from 'react-router-dom'
import ChipInput from 'material-ui-chip-input';

import Form from '../Form/Form'
import Posts from '../Posts/Posts'
import useStyles from "./styles";
import Pagination from '../Pagination';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Home = () => {
    const classes = useStyles();
    const [currentId, setCurrentId] = useState(null);
    const dispatch = useDispatch();
    const query = useQuery();
    const history = useHistory();
    const page = query.get('page') || '1';
    const searchQuery = query.get('searchQuery');
    const [search, setSearch] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            dispatch(getPostsBySearchAsync({ search, tags: tags.join(',') }));
        }
    }

    const handleAdd = (tag: string) => setTags([...tags, tag]);

    const handleDelete = (tagToDelete: string) => setTags(tags.filter((tag) => tag !== tagToDelete));

    const searchPost = () => {
        if (search.trim() || tags) {
            dispatch(getPostsBySearchAsync({ search, tags: tags.join(',') }));
            history.push(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',') || 'none'}`);
        } else {
            history.push('/');
        }
    }

    return (
        <Grow in>
            <Container maxWidth="xl">
                <Grid container className={classes.gridContainer} justifyContent="space-between" alignItems="stretch" spacing={3}>
                    <Grid item xs={12} sm={6} md={9}>
                        <Posts setCurrentId={setCurrentId} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppBar className={classes.appBarSearch} position="static" color="inherit">
                            <TextField
                                name="search"
                                variant="outlined"
                                label="Search Memories"
                                onKeyPress={handleKeyPress}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <ChipInput
                                style={{ margin: '10px 0' }}
                                value={tags}
                                onAdd={handleAdd}
                                onDelete={handleDelete}
                                label="Search Tags"
                                variant="outlined"
                            />
                            <Button
                                onClick={searchPost}
                                color="primary"
                                variant="contained"
                            >
                                Search
                            </Button>
                        </AppBar>
                        <Form currentId={currentId} setCurrentId={setCurrentId} />
                        {(!searchQuery && !tags.length) && (
                            <Paper
                                className={classes.pagination}
                                elevation={6}
                            >
                                <Pagination page={page} />
                            </Paper>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Grow>
    )
}

export default Home
