import axios from 'axios';
import { TAuthDataLocal, TPost, TPostsSearch } from '../types';

const API = axios.create({
    baseURL: 'http://localhost:5000',
});

API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile') || '{}')?.token}`;
    }

    return req;
})

export const fetchPosts = (page: string) => API.get(`/posts?page=${page}`);
export const fetchPost = (id: string) => API.get(`/posts/${id}`);
export const fetchPostsBySearch = (searchQuery: TPostsSearch) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags || 'none'}`);
export const createPost = (newPost: TPost) => API.post('/posts', newPost);
export const updatePost = (id: string, updatedPost: TPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id: string) => API.delete(`/posts/${id}`);
export const likePost = (id: string) => API.patch(`/posts/${id}/likePost`);
export const commentPost = ({ comment, id }: any ) => API.post(`/posts/${id}/commentPost`, { comment: comment } );
export const signIn = (formData: TAuthDataLocal) => API.post('/auth', formData);
export const signUp = (formData: TAuthDataLocal) => API.post('/user/signup', formData);