import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import dayjs from 'dayjs';
import { 
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


function SamplesHistory( props ){

    return(
        <>
            <Grid container>
                <Grid item>
                    SMS
                </Grid>
            </Grid>
        </>
    )
}

export default SamplesHistory;