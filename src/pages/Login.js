import { useState } from 'react';
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
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => { setShowPassword(!showPassword)};

    return(
    <>
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
                        value={props.state.email}
                        onChange={props.handleStateChange}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        required
                        id="Password"
                        label="Password"
                        name="password"
                        value={props.state.password}
                        onChange={props.handleStateChange}
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
                    <Button variant="contained" type="submit" onClick={props.onSubmitLogIn}>Login</Button>
                </Grid>
            </Grid>
        </form>
    </>
    )
}

export default Login;