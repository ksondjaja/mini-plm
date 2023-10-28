import * as React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth } from "./backend/firebase/firebase";
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
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
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => { setShowPassword(!showPassword)};

    const onSubmit = async (e) => {
        e.preventDefault()
       
        await createUserWithEmailAndPassword(auth, state.email, state.password)
          .then((userCredential) => {
              // Signed in
              const user = userCredential.user;
              console.log(user);
              navigate("/login")
              // ...
          })
          .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(errorCode, errorMessage);
              // ..
          });

      }

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