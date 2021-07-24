import React, { Dispatch, FormEvent, useState } from 'react'
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import FileBase from 'react-file-base64';

import useStyles from "./styles";
import { useDispatch } from 'react-redux';
import { createPostAsync, updatePostAsync } from '../../slices/posts';
import { useAppSelector } from '../../app/hooks';
import { useEffect } from 'react';
import { SetStateAction } from 'react';
import { TPost } from '../../types';
import { useHistory } from 'react-router-dom';

interface IFormProps {
    currentId?: string | null;
    setCurrentId: Dispatch<SetStateAction<any>>;
}

const initialState: TPost = {
    name: '',
    title: '',
    message: '',
    tags: [],
    selectedFile: ''
};

const Form = ({ currentId, setCurrentId }: IFormProps) => {
    const classes = useStyles();
    const [postData, setPostData] = useState(initialState)
    const post = useAppSelector<any>((state) => currentId ? state.posts.posts.find((p) => p._id === currentId) : null);
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile') || '{}');
    const routerHistory = useHistory();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (currentId) {
            dispatch(updatePostAsync({ id: currentId, post: { ...postData, name: user?.result?.name} }));
        } else {
            let createPostData = { ...postData, name: user?.result?.name};
            dispatch(createPostAsync({ createPostData, routerHistory }));
        }
        clearFormData();
    }

    useEffect(() => {
        if (post) {
            setPostData(post);
        }
    }, [post])

    const clearFormData = () => {
        setCurrentId(0);
        setPostData(initialState);
    }

    if(!user?.result?.name){
        return (<Paper className={classes.paper}>
            <Typography variant="h6" align="center">
                Please Sign In to create your own memories and like other's memories
            </Typography>
        </Paper>);
    }

    return (
        <Paper className={classes.paper} elevation={6}>
            <form autoComplete="off" noValidate
                className={`${classes.root} ${classes.form}`}
                onSubmit={handleSubmit}
            >
                <Typography variant="h6">{currentId ? 'Editing' : 'Creating'} a Memory</Typography>
                <TextField name="title" variant="outlined"
                    label="Title"
                    fullWidth
                    value={postData.title}
                    onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                />
                <TextField name="message" variant="outlined"
                    label="Message"
                    fullWidth
                    value={postData.message}
                    onChange={(e) => setPostData({ ...postData, message: e.target.value })}
                />
                <TextField name="tags" variant="outlined"
                    label="Tags"
                    fullWidth
                    value={postData.tags}
                    onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })}
                />
                <div className={classes.fileInput}>
                    <FileBase
                        type="file"
                        multiple={false}
                        onDone={({ base64 }: any) => setPostData({ ...postData, selectedFile: base64 })}
                    ></FileBase>
                    <Button className={classes.buttonSubmit}
                        variant="contained"
                        color="primary"
                        size="large"
                        type="submit"
                        fullWidth
                    >Submit</Button>
                    <Button className={classes.buttonSubmit}
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={clearFormData}
                        fullWidth
                    >Clear</Button>
                </div>
            </form>
        </Paper>
    )
}

export default Form
