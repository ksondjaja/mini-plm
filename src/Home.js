import * as React from 'react';
import { Layout } from "core";
import {
    Grid,
    TextField,
    Box,
    Typography,
    Button
} from '@mui/material';

function Home(props) {

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
            <Grid container spacing={3} textAlign="center">
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
            </Grid>
        </Layout>
    );
}

export default Home;