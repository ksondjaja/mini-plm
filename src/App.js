//Change login to NOT use loggedIn state, but persistent login with Firebase + JWT-based Cookies
//https://firebase.google.com/docs/auth/admin/manage-cookies
//Create separate function to handle all login/logout (not just in login page?)

// https://www.youtube.com/watch?v=Jfkme6WE_Dk&ab_channel=DailyWebCoding
// continue from 27:14 to work on backend/Express

import { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";
import { auth } from './firebase';
import { signOut, signInWithEmailAndPassword } from "firebase/auth";
import { Layout } from "core";
import Nav from "./Nav";
import Login from './pages/Login';
import Home from './pages/Home';
import CreateStyle from './pages/CreateStyle';
import StylePage from './pages/StylePage';


function App (props) {

  // Upon loading page, automatically login if last login is less than 24 hours ago
  // Conversely, remove saved login if last login were more than 24 hours ago
  const getStoredAuth = () =>{
    const now = new Date().getTime();
    const loginTime = window.localStorage.getItem('loginTime') ?? 0;
    if(now-loginTime > 24*60*60*1000){
      return false
    }else{
      return true
    }
  }

  const autoLogin = window.localStorage.getItem('auth')==='true' && getStoredAuth;

  const [state, setState] = useState(
      {
          loggedIn: autoLogin ?? false,
          email: window.localStorage.getItem('mini-plm-user')
      }
  )
  const [token, setToken] = useState(window.localStorage.getItem('mini-plm-access') ?? '');

  const navigate = useNavigate()


  //Manual Login function
  const onSubmitLogIn = async (e) => {
    e.preventDefault()

    // Record login time for auto logout after 24 hours
    const loginTime = new Date().getTime();

    // Firebase login
    await signInWithEmailAndPassword(auth, state.email, state.password)
      .then((userCred) => {
          
          // Set login state and localStorage
          if(userCred){

            setState({
              ...state,
              loggedIn: true,
            });

            window.localStorage.setItem('loginTime', loginTime);
            window.localStorage.setItem('auth', 'true');
            window.localStorage.setItem('mini-plm-user', state.email);
          }

          navigate("/home");
      })
      .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
      });
  }

  // Manual Logout function
  const logOut = async(e) => {
    e.preventDefault();

    //Firebase Signout
    signOut(auth).then(() => {

      //Remove login from localStorage and state
      window.localStorage.removeItem("auth");
      window.localStorage.removeItem("mini-plm-user");
      window.localStorage.removeItem("mini-plm-access");

      setState({
        ...state,
        loggedIn: false
      });
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
 
  }

  // Change login form state
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
    logOut,
    handleStateChange
  }

  // Temporary solution for persistent login
  useEffect(()=>{
    // Autologin if user is still logged in through Firebase & last loging was less than 24 hours ago
    auth.onAuthStateChanged((userCred) => {
      if(userCred && getStoredAuth){

        setState({
          ...state,
          loggedIn: true,
        });

        window.localStorage.setItem("auth", "true");

        userCred.getIdToken().then((token)=>{
            // console.log('Token: '+token);
            setToken(token);
            window.localStorage.setItem("mini-plm-access", token);
        })
      }
    })}
  ,[])

  return (
    <>
      <Nav {...props}/>

      <Layout>

        <Routes>

          <Route
            exact path="/login"
            element={
              state.loggedIn?
                <Navigate to="/home"/>
              :
                <Login
                  onSubmitLogIn = {onSubmitLogIn}
                  {...props}
                />
            }
          />

          <Route
            exact path="/home"
            element={
              state.loggedIn ?
                <Home
                  token={token}
                  {...props}
                />
              :
                <Navigate to="/login"/>
            }
          />

          <Route
            exact path="/createstyle"
            element={
              state.loggedIn ?
                <CreateStyle
                  handleStateChange = {handleStateChange}
                  token={token}
                  {...props}
                />
                :
                <Navigate to="/login"/>
              }
            />

            <Route
              path="/stylepage/:id"
              element={
                state.loggedIn ?
                  <StylePage
                    token = {token}
                    {...props}
                  />
                :
                  <Navigate to="/login"/>
              }
            />

          <Route
            path="*"
            element={
                state.loggedIn ?
                  <Navigate to="/home"/>
                : 
                  <Navigate to="/login"/>
              }
          />

        </Routes>

        
      </Layout>
    </>
  )
};

export default App;
