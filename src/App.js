//Change login to NOT use loggedIn state, but persistent login with Firebase + JWT-based Cookies
//https://firebase.google.com/docs/auth/admin/manage-cookies
//Create separate function to handle all login/logout (not just in login page?)

// https://www.youtube.com/watch?v=Jfkme6WE_Dk&ab_channel=DailyWebCoding
// continue from 27:14 to work on backend/Express

import { useState } from 'react';
import Nav from "./Nav";
import Auth from './pages/Auth';

function App (props) {

  const [state, setState] = useState(
      {
          loggedIn: false || window.localStorage.getItem('auth')==='true'
      }
  )
  const [token, setToken] = useState('');


  const logIn = event => {
      setState({
        ...state,
        loggedIn: true
      });
    }

  const logOut = event => {
      setState({
        ...state,
        loggedIn: false
      });
    }

  const handleStateChange = event => {
      const value = event.target.value;

      setState({
        ...state,
        [event.target.name]: value
      });
  }

  props = {
    state,
    setState,
    token,
    setToken,
    logIn,
    logOut,
    handleStateChange
  }

  return (
    <>
      <Nav {...props}/>

      <Auth {...props}/>
    </>
  )
};

export default App;
