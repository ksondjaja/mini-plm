import { useEffect } from 'react';
import {
    Routes,
    Route,
    Navigate,
    useNavigate
  } from "react-router-dom";
import { auth } from '../backend/firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Layout } from "core";
import Home from './Home';
import Login from './Login';


function Auth(props) {

  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()

    await signInWithEmailAndPassword(auth, props.state.email, props.state.password)
      .then((userCred) => {
          // console.log('User Cred: ' + userCred);
          
          // Temporary login by setting loggedIn state to true
          if(userCred){
            props.logIn()
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

    // Temporary solution for persistent login
    useEffect(()=>{
        auth.onAuthStateChanged((userCred) => {
            if(userCred){
              props.logIn()
                window.localStorage.setItem("auth", "true")
                userCred.getIdToken().then((token)=>{
                    // console.log('Token: '+token);
                    props.setToken(token);
                })
            }
        })}
    ,[])

    return (
      <Layout>

        <Routes>
          <Route path="/"
            element={
                props.state.loggedIn ?
                  <Navigate to="/home"/>
                : 
                  <Navigate to="/login"/>
              }
          />

          <Route
            exact path="/login"
            element={
              props.state.loggedIn?
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
              props.state.loggedIn ?
                <Home
                  token={props.token}
                  {...props}
                />
              :
                <Navigate to="/login"/>
            }
          />
        </Routes>

        
      </Layout>
    );
  }
  
  export default Auth;