// use API tutorial: https://www.youtube.com/watch?v=NqdqnfzOQFE&ab_channel=DaveGray
// Axios setup tutorial from https://www.youtube.com/watch?v=NqdqnfzOQFE&ab_channel=DaveGray


import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Layout } from "core";
import StyleList from "pages/StyleList";
import {
    Grid,
    TextField,
    Box,
    Typography,
    Button
} from '@mui/material';
const BACKEND_URL_STYLES = process.env.REACT_APP_BACKEND_URL_STYLES;

function Home( props ) {

    const { token } = props;

    const [response, setResponse] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);


    const controller = new AbortController();
        
    const fetchData = async () => {
        try {
            const res = await axios.get(BACKEND_URL_STYLES,
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            );
            //console.log('Response: ' + JSON.stringify(res.data) );
            setResponse(res.data);
        } catch(err){
            //console.log('Error: ' + JSON.stringify(err.message));
            setError(JSON.stringify(err.message));
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(token){
            fetchData();
        }

        //useEffect cleanup function
        return() => controller.abort();
    }, [token]);

    return (
        <Layout>
            <Grid container textAlign="left">
                <Grid item mb={0} xs={10}>
                    <Typography variant="h4">
                        Hello {props.state.email}
                        {/* 
                            props.state.email resets to blank when window is refreshed.
                            Should replace with localstorage or something
                            Maybe also make a database to map user email to name, user type/role/access
                        */}
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Button component={Link} to="/createstyle" variant="outlined">
                        Create New Style
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={3} mt={4} mb={2} display="flex" justifyContent="center" alignItems="center">
                <Grid item xs={7}>
                    <TextField
                        label='Enter Style Name, Number, Category, etc'
                        name='search'
                        fullWidth
                    />
                </Grid>
                <Grid item xs={2}>
                    <Button variant="contained">Search</Button>
                </Grid>
            </Grid>

            <StyleList 
                response = {response}
                token = {token}
                loading = {loading}
                error = {error}
                {...props}
            />
            
        </Layout>
    );
}

export default Home;