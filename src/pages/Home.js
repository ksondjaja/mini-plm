// use API tutorial: https://www.youtube.com/watch?v=NqdqnfzOQFE&ab_channel=DaveGray
// Axios setup tutorial from https://www.youtube.com/watch?v=NqdqnfzOQFE&ab_channel=DaveGray
// LOCAL JSON SERVER FOR TESTING tutorial: https://www.youtube.com/watch?v=_j3yiadVGQA&ab_channel=CodeWithYousaf
// COMMAND TO RUN LOCAL SERVER: npx json-server --watch db.json --port 3001


import { useState, useEffect } from "react";
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
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Home(props, { token }) {

    const [response, setResponse] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);


    useEffect(()=>{
        const controller = new AbortController();
        
        const fetchData = async () => {
            try {
                const res = await axios.get(BACKEND_URL, {
                    headers: {
                        Authorization: 'Bearer' + token
                    }
                });
                console.log(res);
                setResponse(res.data);
            } catch(err){
                console.log(err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if(token){
            fetchData();
        }

        //useEffect cleanup function
        return() => controller.abort();
    }, [token]);

    return (
        <Layout>
            <Grid container spacing={3} textAlign="center">
                <Typography variant="h2">
                    Hello {props.state.email}
                </Typography>
            </Grid>
            <Grid container spacing={3} my={4} display="flex" justifyItems="stretch" alignItems="center">
                <Grid item xs={9}>
                    <TextField
                        label='Enter Style Name, Number, Category, etc'
                        name='search'
                        fullWidth
                    />
                </Grid>
                <Grid item xs={3}>
                    <Button variant="contained">Search</Button>
                </Grid>
            </Grid>

            <StyleList 
                style={response}
                {...props}
            />
            
        </Layout>
    );
}

export default Home;