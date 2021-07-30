import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from '../api';
import { TAuthDataLocal } from '../types';
import { RouteComponentProps } from 'react-router-dom';

type signinProps =  {
    formData: TAuthDataLocal,
    routerHistory: RouteComponentProps["history"]
}

const initialState = {
    authData: {},
    error: false,
    errorMessge: ""
}

export const signinAsync = createAsyncThunk(
    'auth/signin',
    async ({formData, routerHistory}: signinProps, ThunkAPI) => {
        try {
            const { data } = await api.signIn(formData);
            ThunkAPI.dispatch(login(data));
            routerHistory.push('/');
        } catch (error) {
            ThunkAPI.dispatch(authError(error.response.data.message));
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
        } catch (error: any) {
            ThunkAPI.dispatch(authError(error.response.data.message));
            
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
        },
        authError: (state, action) => {
            state.error = true;
            state.errorMessge = action.payload;
        },
        clearAuthError: (state) => {
            state.error = false;
            state.errorMessge = "";
        }
    }
});

export const { login, logout, authError, clearAuthError } = authSlice.actions;

export default authSlice.reducer;