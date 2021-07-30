import { Avatar, Button, Paper, Grid, Typography, Container, Snackbar } from "@material-ui/core";
import LockOutlined from "@material-ui/icons/LockOutlined";
import { FormEvent, useState } from "react";
import Input from "./Input";
import { useHistory } from "react-router-dom"

import useStyles from "./styles";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearAuthError, signinAsync, signupAsync } from "../../slices/auth";
import { TAuthDataLocal } from "../../types";
import { Alert } from "@material-ui/lab";
import { useEffect } from "react";

const initialState: TAuthDataLocal = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
}

const Auth = () => {

    const distpatch = useAppDispatch();
    const routerHistory = useHistory();
    const classes = useStyles();

    const [showPassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const [open, setOpen] = useState(false);
    const errorMessage = useAppSelector((state) => state.auth.errorMessge);

    useEffect(() => {
        if(errorMessage)
            showErrorBox();
    }, [errorMessage]);

    const handleClose = () => {
        setOpen(false);
        distpatch(clearAuthError());
    };

    const showErrorBox = () => {
        setOpen(true);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isSignup) {
            distpatch(signupAsync({ formData, routerHistory }));
        } else {
            distpatch(signinAsync({ formData, routerHistory }));
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    }

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

    return (
        <Container
            component="main"
            maxWidth="xs"
        >
            <Paper
                className={classes.paper}
                elevation={3}
            >
                <Avatar className={classes.avatar}>
                    <LockOutlined />
                </Avatar>
                <Typography
                    variant="h5"
                >
                    {isSignup ? 'Sign up' : 'Sign in'}
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {
                            isSignup && (
                                <>
                                    <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                                    <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                                </>
                            )
                        }
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                        {isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        {isSignup ? 'Sign Up' : 'Sign In'}
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Button onClick={switchMode}>
                            {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                        </Button>
                    </Grid>
                </form>
            </Paper>
            <Snackbar open={open} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Container>
    )
}

export default Auth
