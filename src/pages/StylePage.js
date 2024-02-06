import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import StyleInfo from './style-tabs/StyleInfo';
import { 
    Layout,
    StyleAttribute
} from "core";
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

    const { fetchStyle, currentStyle, token } = props;

    const params = useParams();
    const styleid = JSON.stringify(params["id"]);

    const controller = new AbortController();
    

    useEffect(()=>{
        console.log(styleid);
        // fetchStyle(styleid);

        //useEffect cleanup function
        return() => controller.abort();
    }, [token]);

    return(
        <Layout>
            {props.currentStyle && props.token &&
                <StyleInfo
                    styleDetails = {currentStyle["Item"]}
                    token = {token}
                    {...props}
                />
            }
            
        </Layout>
    )
}

export default StylePage;