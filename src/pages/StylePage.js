import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
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
    const styleDetails = currentStyle["Item"];

    const BACKEND_URL_STYLES = process.env.REACT_APP_BACKEND_URL_STYLES;
    const navigate = useNavigate()
    const controller = new AbortController();


    const deleteStyle = async (styleid) => {

        const StyleId= JSON.stringify(styleid);

        console.log(StyleId);

        try{
            const res = await axios.delete(
                (BACKEND_URL_STYLES + `/delete/${StyleId}`),
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            )
            console.log('Response: ' + JSON.stringify(res.data));

            navigate('/home');
        }catch(err){
            console.log('Error: ' + JSON.stringify(err.message));
        }
    }

    const handleDeleteStyle = event => {
        event.preventDefault();

        //In popup, ask user to confirm. Then show feedback message that style has been deleted.

        deleteStyle(styleDetails.StyleId);
    }

    useEffect(()=>{
        return() => controller.abort();
    }, [token]);

    return(
        <Layout>
            {props.currentStyle && props.token &&
                <>
                <Grid container mb={3} justifyContent="flex-end">
                    <Grid item>
                        <Button color="error" variant="contained" onClick={handleDeleteStyle}>
                            Delete Style
                        </Button>
                    </Grid>
                </Grid>
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