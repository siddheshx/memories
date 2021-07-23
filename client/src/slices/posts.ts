import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TPost } from '../types';
import * as api from '../api';

type PostsState = {
    posts: TPost[];
}

const initialState: PostsState = {
    posts: []
};

export const getPostsAsync = createAsyncThunk(
    'posts',
    async () => {
        try {
            const { data } = await api.fetchPosts();
            return data;
        } catch (error) {
            console.log(error);
        }
    }
);

export const createPostAsync = createAsyncThunk(
    'posts/create',
    async (post: TPost) => {
        try {
            const { data } = await api.createPost(post);

            return data;
        } catch (error) {
            console.log(error);
        }
    }
);

export const updatePostAsync = createAsyncThunk(
    'posts/update',
    async ({ id, post }: { id: string, post: TPost }) => {
        try {
            const { data } = await api.updatePost(id, post);

            return data;
        } catch (error) {
            console.log(error);
        }
    }
);

export const deletePostAsync = createAsyncThunk(
    'posts/delete',
    async (id: string | undefined) => {
        try {
            if (id) {
                await api.deletePost(id);
                return id;
            }
        } catch (error) {
            console.log(error);
        }
    }
);

export const likePostAsync = createAsyncThunk(
    'posts/likePost',
    async (id: string | undefined) => {
        try {
            if (id) {
                const { data } = await api.likePost(id);
                return data;
            }
        } catch (error) {
            console.log(error);
        }
    }
);

export const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getPostsAsync.fulfilled, (state, action) => {
                state.posts = action.payload;
            })
            .addCase(createPostAsync.fulfilled, (state, action) => {
                state.posts.push(action.payload);
            })
            .addCase(updatePostAsync.fulfilled, (state, action) => {
                const index = state.posts.findIndex((post) => post._id === action.payload._id)
                if (index !== -1) 
                    state.posts[index] = action.payload
            })
            .addCase(deletePostAsync.fulfilled, (state, action) => {
                const index = state.posts.findIndex((post) => post._id === action.payload);
                if (index !== -1) 
                    state.posts.splice(index, 1);
            })
            .addCase(likePostAsync.fulfilled, (state, action) => {
                const index = state.posts.findIndex((post) => post._id === action.payload._id)
                if (index !== -1) 
                    state.posts[index].likes = action.payload.likes
            })
    }
});

export default postsSlice.reducer;