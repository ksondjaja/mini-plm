import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
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

    const { currentStyle, token } = props;
    const styleDetails = currentStyle["Item"];

    const controller = new AbortController();
    

    useEffect(()=>{
        return() => controller.abort();
    }, [token]);

    return(
        <Layout>
            {props.currentStyle && props.token &&
                <StyleInfo
                    styleDetails = {styleDetails}
                    token = {token}
                    {...props}
                />
            }
            
        </Layout>
    )
}

export default StylePage;