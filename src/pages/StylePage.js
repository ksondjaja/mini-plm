import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout } from "core";
import {
    Grid,
    TextField,
    Select,
    MenuItem,
    Box,
    Typography,
    Button
} from '@mui/material';


function StylePage( props ) {

    const { currentStyle, token } = props;

    const BACKEND_URL_STYLES = process.env.REACT_APP_BACKEND_URL_STYLES;

    const controller = new AbortController();

    const styleDetails = currentStyle["Item"];

    useEffect(()=>{

        //useEffect cleanup function
        return() => controller.abort();
    }, [token]);

    return(
        <Layout>
            {props.currentStyle && props.token &&
                <>
                <Grid container mb={3}>
                    <Grid item xs={6}>
                        <Typography variant="h6" color="primary">
                            {styleDetails.Category}   {styleDetails.Season}   {styleDetails.DeliveryDate? JSON.stringify(styleDetails.DeliveryDate).slice(1,5) : ''}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={3}>
                        <Typography variant="h5" color="primary">
                            <b>{styleDetails.StyleName}</b>
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container mb={3}>
                    <Grid item xs={4}>
                        <Typography variant="body1" color="primary">
                            <b>{styleDetails.FabricType} {styleDetails.Silhouette} {styleDetails.Commodity}</b>
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="body1" color="black">
                            Size Range: {styleDetails.SizeRange}
                        </Typography>
                    </Grid>
                </Grid>
                </> 
            }
            
        </Layout>
    )
}

export default StylePage;