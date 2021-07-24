import { AppBar, Typography, Toolbar, Avatar, Button } from '@material-ui/core';
import { Link, useHistory, useLocation } from "react-router-dom";
import decode from 'jwt-decode'

import useStyles from "./styles";
import memoriesLogo from '../../images/memoriesLogo.png';
import memoriesText from '../../images/memoriesText.png';
import { useState } from 'react';
import { useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { logout } from '../../slices/auth';

const Navbar = () => {
    const classes = useStyles();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile') || '{}'));
    const dispatch = useAppDispatch();
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        const token = user?.token;
        if (token) {
            const decodedToken: any = decode(token);
            if (decodedToken.exp * 1000 < new Date().getTime()) {
                logout();
            }
        }

        setUser(JSON.parse(localStorage.getItem('profile') || '{}'));
        // eslint-disable-next-line
    }, [location]);

    const handleLogout = () => {
        dispatch(logout());
        history.push('/');
        setUser({});
    }

    return (
        <AppBar className={classes.appBar} position="static" color="inherit">
            <Link to="/posts" className={classes.brandContainer}>
                <img src={memoriesText} alt="icon" height="45px" />
                <img className={classes.image} src={memoriesLogo} alt="icon" height="40px" />
            </Link>
            <Toolbar className={classes.toolbar}>
                {user?.result ? (
                    <div className={classes.profile}>
                        <Avatar
                            className={classes.purple}
                            alt={user.result.name}
                            src={user.result.imageUrl}
                        >
                            {user.result.name.charAt(0)}
                        </Avatar>
                        <Typography className={classes.userName}
                            variant="h6"
                        >
                            {user.result.name}
                        </Typography>
                        <Button
                            variant="contained"
                            className={classes.logout}
                            color="secondary"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </div>
                ) : (
                    <Button component={Link} to="/auth" variant="contained" color="primary">Signin</Button>
                )}
            </Toolbar>

        </AppBar>
    )
}

export default Navbar
