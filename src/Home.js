import * as React from 'react';
import { Layout } from "core";
import StyleList from "pages/StyleList";
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

            <StyleList />
            
        </Layout>
    );
}

export default Home;