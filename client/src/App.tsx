import { Container } from '@material-ui/core'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import PostDetails from './components/PostDetails/PostDetails';
import { useAppSelector } from './app/hooks';

const App = () => {
    let user = useAppSelector((state) => state.auth.authData);

    if (Object.keys(user).length === 0) {
        user = JSON.parse(localStorage.getItem('profile') || '{}');
    }

    return (
        <BrowserRouter>
            <Container maxWidth="xl">
                <Navbar />
                <Switch>
                    <Route path="/" exact component={() => <Redirect to="/posts" />}/>
                    <Route path="/posts" exact component={Home}/>
                    <Route path="/posts/search" exact component={Home}/>
                    <Route path="/posts/:id" exact component={PostDetails}/>
                    <Route path="/auth" exact component={() => ((!user) ? <Redirect to="/posts" />  : <Auth/> ) }/>
                </Switch>
            </Container>
        </BrowserRouter>
    )
}

export default App
