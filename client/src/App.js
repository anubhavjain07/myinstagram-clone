import React, { useEffect, createContext, useReducer, useContext } from 'react';
import NavBar from './components/Navbar';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import Home from './components/screens/Home';
import Signin from './components/screens/Signin';
import Signup from './components/screens/Signup';
import Profile from './components/screens/Profile';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import SubscribedUserPost from './components/screens/SubscribedUserPosts';
import { reducer, initialState } from './reducers/userReducer';
import ResetPassword from './components/screens/Reset';
import NewPassword from './components/screens/Newpassword';

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: 'USER', payload: user });
      // history.push('/');
    }
    else {
      if (!history.location.pathname.startsWith('/reset'))
        history.push('/signin');
    }
  }, []);
  return (
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/signin' component={Signin} />
      <Route path='/signup' component={Signup} />
      <Route exact path='/profile' component={Profile} />
      <Route path='/create' component={CreatePost} />
      <Route exact path='/reset' component={ResetPassword} />
      <Route path='/reset/:token' component={NewPassword} />
      <Route path='/myfollowingpost' component={SubscribedUserPost} />
      <Route path='/profile/:userid' component={UserProfile} />
    </Switch>

  );

}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
