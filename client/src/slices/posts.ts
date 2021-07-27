import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TPost, TPostsSearch } from '../types';
import * as api from '../api';
import { RouteComponentProps } from 'react-router-dom';

type PostsState = {
    posts: TPost[];
    currentPage: number;
    numberOfPages: number;
    isLoading: boolean;
    post: TPost;
}

const initialState: PostsState = {
    posts: [],
    currentPage: 1,
    numberOfPages: 1,
    isLoading: false,
    post: {} as TPost
};

export const getPostsAsync = createAsyncThunk(
    'posts',
    async (page: string) => {
        try {
            const { data } = await api.fetchPosts(page);
            return data;
        } catch (error) {
            console.log(error);
        }
    }
);

export const getPostAsync = createAsyncThunk(
    'post',
    async (id: string) => {
        try {
            const { data } = await api.fetchPost(id);
            return data;
        } catch (error) {
            console.log(error);
        }
    }
);

export const getPostsBySearchAsync = createAsyncThunk(
    'posts/bySearch',
    async (searchQuery: TPostsSearch) => {
        try {
            const { data } = await api.fetchPostsBySearch(searchQuery);
            return data;
        } catch (error) {
            console.log(error);
        }
    }
);

type CratePostProps = {
    createPostData: TPost,
    routerHistory: RouteComponentProps["history"]
}

export const createPostAsync = createAsyncThunk(
    'posts/create',
    async ({createPostData, routerHistory }: CratePostProps) => {
        try {
            const { data } = await api.createPost(createPostData);
            routerHistory.push(`/posts/${data._id}`);
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

type commentPostProps = {
    comment: string;
    _id: string | undefined
}

export const commentPostAsync = createAsyncThunk(
    'posts/commentPost',
    async ({ comment, _id }: commentPostProps) => {
        try {
            if (_id) {
                const { data } = await api.commentPost({ comment: comment, id: _id });
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
        clearPost: (state) => {
            state.post = {} as TPost;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPostsAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getPostsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.posts = action.payload.data;
                state.currentPage = action.payload.currentPage;
                state.numberOfPages = action.payload.numberOfPages;
            })
            .addCase(getPostAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getPostAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.post = action.payload;
            })
            .addCase(createPostAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createPostAsync.fulfilled, (state, action) => {
                state.isLoading = false;
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

            .addCase(commentPostAsync.fulfilled, (state, action) => {
                const index = state.posts.findIndex((post) => post._id === action.payload._id)
                if (index !== -1)
                    state.posts[index].comments = action.payload.comments
            })
            .addCase(getPostsBySearchAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getPostsBySearchAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.posts = action.payload;
            })
    }
});

export const { clearPost } = postsSlice.actions;

export default postsSlice.reducer;