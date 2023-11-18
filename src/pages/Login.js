// https://www.youtube.com/watch?v=Jfkme6WE_Dk&ab_channel=DailyWebCoding
// continue from 14:30

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../backend/firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Layout } from "core";
import {
    Grid,
    Typography,
    Button,
    TextField,
    IconButton,
    InputAdornment
    } from '@mui/material/';
import {
    Visibility,
    VisibilityOff
    } from '@mui/icons-material/';

function Login(props) {
    const navigate = useNavigate()
    
    const { state, handleStateChange } = props;
    const [showPassword, setShowPassword] = useState(false);
    const [token, setToken] = useState('');

    const handleClickShowPassword = () => { setShowPassword(!showPassword)};

    const onSubmit = async (e) => {
        e.preventDefault()

        await signInWithEmailAndPassword(auth, state.email, state.password)
          .then((userCred) => {
              // Signed in
              console.log(userCred);
              
              // Temporary login by setting loggedIn state to true
              if(userCred){
                props.logIn()
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
                userCred.getIdToken().then((token)=>{
                    console.log(token);
                    setToken(token);
                })
            }
        })}
    ,[])

    return (
      <Layout>
        <Typography variant="h3">
            User Login
        </Typography>
        <br/>
        <form>
            <Grid container
                display="flex"
                alignItems="center"
                justifyContent="center"
                spacing={1}
            >
                <Grid item>
                    <TextField
                        required
                        id="Email"
                        label="Email"
                        name="email"
                        type="text"
                        value={state.email}
                        onChange={handleStateChange}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        required
                        id="Password"
                        label="Password"
                        name="password"
                        value={state.password}
                        onChange={handleStateChange}
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                    >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
                <Grid item>
                    <Button variant="contained" type="submit" onClick={onSubmit}>Login</Button>
                </Grid>
            </Grid>
        </form>
      </Layout>
    );
  }
  
  export default Login;