import { Avatar, Button, Paper, Grid, Typography, Container } from "@material-ui/core";
import LockOutlined from "@material-ui/icons/LockOutlined";
import { FormEvent, useState } from "react";
import Input from "./Input";
import { GoogleLogin } from "react-google-login";
import { useHistory } from "react-router-dom"

import useStyles from "./styles";
import Icon from "./icon";
import { useAppDispatch } from "../../app/hooks";
import { login, signinAsync, signupAsync } from "../../slices/auth";
import { TAuthDataLocal } from "../../types";

const initialState: TAuthDataLocal = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confrimPassword: ''
}

const Auth = () => {

    const distpatch = useAppDispatch();
    const routerHistory = useHistory();
    const classes = useStyles();

    const [showPassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState(initialState);
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isSignup) {
            distpatch(signupAsync({formData, routerHistory}));
        }else{
            distpatch(signinAsync({formData, routerHistory}));
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

    const googleSuccess = async (res: any) => {
        const result = res?.profileObj;
        const token = res?.tokenId;
        try {
            distpatch(login({ result: result, token: token }));
            routerHistory.push('/');
        } catch (error) {
            console.log(error);
        }
    }
    const googleFailure = (error: any) => {
        console.log("Google sing in was unsuccessful. Try Agian later!")
    }

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
                        {isSignup && <Input name="confrimPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        {isSignup ? 'Sign Up' : 'Sign In'}
                    </Button>

                    <GoogleLogin
                        clientId="866730088271-unud01u10c503cp4lttk5tsu6m999jv7.apps.googleusercontent.com"
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                        cookiePolicy="single_host_origin"
                        render={(renderProps) => (
                            <Button color="primary"
                                fullWidth
                                onClick={renderProps.onClick}
                                disabled={renderProps.disabled}
                                className={classes.googleButton}
                                startIcon={<Icon />}
                                variant="contained"
                            >
                                Google Sign In
                            </Button>
                        )}
                    />
                    <Grid container justifyContent="flex-end">
                        <Button onClick={switchMode}>
                            {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                        </Button>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default Auth
