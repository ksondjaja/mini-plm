// use API tutorial: https://www.youtube.com/watch?v=NqdqnfzOQFE&ab_channel=DaveGray

import React from "react";
import useAxios from "../hooks/useAxios";
import axios from "backend/apis/Styles";
import {
    Grid,
    TextField,
    Box,
    Typography,
    Button
} from '@mui/material';

const StyleList = () => {
    const [style, error, loading] = useAxios({
        axiosInstance: axios,
        method: 'GET',
        url: '/',
        requestConfig: {
            headers: {
                'Content-Language': 'en-CA',
                'Accept': 'text/html'
            }
        }
    })

    console.log(style);

    return (
        <Grid container spacing={3} textAlign="center">
            {loading && <p>Loading...</p>}
            {!loading && error && <p>{error}</p>}
            {!loading && !error && !style && <p>No Styles in Database</p>}

            {!loading && !error && style &&
                style.map((s, i) => (
                <Grid item key={i} xs={4} textAlign="left">
                    <Box border={2} padding={2}>
                        <Typography variant="h5">
                            {s.StyleName}
                        </Typography>
                        <Typography variant="body1">
                            <b>Season:</b> {s.Season}
                        </Typography>
                        <Typography variant="body1">
                            <b>Category:</b> {s.Category}
                        </Typography>
                    </Box>
                </Grid>
                ))
            
                
            }
            

            {/* <Grid container spacing={3} textAlign="center">
                <Grid item xs={4}>
                    <Box>
                        <Typography varian="h4">Style 1</Typography>
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Box>
                        <Typography varian="h4">Style 2</Typography>
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Box>
                        <Typography varian="h4">Style 3</Typography>
                    </Box>
                </Grid>
            </Grid> */}

        </Grid>
    )
}

export default StyleList;