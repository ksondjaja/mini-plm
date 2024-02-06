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
import axios from 'axios';
import { auth } from './firebase';
import { signOut, signInWithEmailAndPassword } from "firebase/auth";
import { Layout } from "core";
import Nav from "./Nav";
import Login from './pages/Login';
import Home from './pages/Home';
import CreateStyle from './pages/CreateStyle';
import StylePage from './pages/StylePage';


function App (props) {

  const [state, setState] = useState(
      {
          loggedIn: false || window.localStorage.getItem('auth')==='true',
          email: window.localStorage.getItem('mini-plm-user')
      }
  )
  const [token, setToken] = useState('');
  const [currentStyle, setCurrentStyle] = useState();


  const BACKEND_URL_STYLES = process.env.REACT_APP_BACKEND_URL_STYLES;

  const navigate = useNavigate()


  const logIn = e => {
      setState({
        ...state,
        loggedIn: true,
      });
  }

  const onSubmitLogIn = async (e) => {
    e.preventDefault()

    await signInWithEmailAndPassword(auth, state.email, state.password)
      .then((userCred) => {
          // console.log('User Cred: ' + userCred);
          
          // Temporary login by setting loggedIn state to true
          if(userCred){
            logIn()
            window.localStorage.setItem("auth", "true")
            window.localStorage.setItem("mini-plm-user", state.email)
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
      window.localStorage.removeItem("mini-plm-user");

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

  const fetchStyle = async (styleid) => {

      const StyleId= JSON.stringify(styleid);

      console.log(StyleId);

      try{
          const res = await axios.get(
              (BACKEND_URL_STYLES + `/${StyleId}`),
              {
                  headers: {
                      Authorization: 'Bearer ' + token
                  }
              }
          )
          console.log('Response: ' + JSON.stringify(res.data));
          setCurrentStyle(res.data);
      }catch(err){
          console.log('Error: ' + JSON.stringify(err.message));
      }
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
    fetchStyle,
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
                  setCurrentStyle={setCurrentStyle}
                  fetchStyle={fetchStyle}
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
              exact path="/stylepage/:id"
              element={
                state.loggedIn ?
                  <StylePage
                    token = {token}
                    currentStyle = {currentStyle}
                    fetchStyle = {fetchStyle}
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
