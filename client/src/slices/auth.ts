import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from '../api';
import { TAuthDataLocal } from '../types';
import { RouteComponentProps } from 'react-router-dom';

type signinProps =  {
    formData: TAuthDataLocal,
    routerHistory: RouteComponentProps["history"]
}

const initialState = {
    authData: {}
}

export const signinAsync = createAsyncThunk(
    'auth/signin',
    async ({formData, routerHistory}: signinProps, ThunkAPI) => {
        try {
            const { data } = await api.signIn(formData);

            ThunkAPI.dispatch(login(data));
            routerHistory.push('/');
        } catch (error) {
            console.log(error);
        }
    }
);

export const signupAsync = createAsyncThunk(
    'auth/signup',
    async ({formData, routerHistory}: signinProps, ThunkAPI) => {
        try {
            const { data } = await api.signUp(formData);

            ThunkAPI.dispatch(login(data));
            routerHistory.push('/');
        } catch (error) {
            console.log(error);
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            localStorage.setItem('profile', JSON.stringify({ ...action?.payload }));
            state.authData = action?.payload 
        },
        logout: (state) => {
            localStorage.clear();
            state.authData = {}
        }
    }
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;