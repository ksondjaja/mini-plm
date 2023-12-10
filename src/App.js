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
import Home from './pages/Home';
import Login from './pages/Login';


function App (props) {

  const [state, setState] = useState(
      {
          loggedIn: false || window.localStorage.getItem('auth')==='true'
      }
  )
  const [token, setToken] = useState('');


  const logIn = e => {
      setState({
        ...state,
        loggedIn: true
      });
  }

  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()

    await signInWithEmailAndPassword(auth, state.email, state.password)
      .then((userCred) => {
          // console.log('User Cred: ' + userCred);
          
          // Temporary login by setting loggedIn state to true
          if(userCred){
            logIn()
            window.localStorage.setItem("auth", "true")
          }

          navigate("/home");
      })
      .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
      });
  }

  const logOut = async(e) => {
    e.preventDefault();

    signOut(auth).then(() => {

      window.localStorage.removeItem("auth");

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

  // Temporary solution for persistent login
  useEffect(()=>{
    auth.onAuthStateChanged((userCred) => {
        if(userCred){
          logIn();
          window.localStorage.setItem("auth", "true");
          userCred.getIdToken().then((token)=>{
              // console.log('Token: '+token);
              setToken(token);
          })
          navigate("/home");
        }
    })}
  ,[])

  return (
    <>
      <Nav {...props}/>

      <Layout>

        <Routes>
          <Route path="/"
            element={
                state.loggedIn ?
                  <Navigate to="/home"/>
                : 
                  <Navigate to="/login"/>
              }
          />

          <Route
            exact path="/login"
            element={
              state.loggedIn?
                <Navigate to="/home"/>
              :
                <Login
                  onSubmit = {onSubmit}
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
        </Routes>

        
      </Layout>
    </>
  )
};

export default App;