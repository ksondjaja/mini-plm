import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import dayjs from 'dayjs';
import CreateSampleDialog from "./Samples/CreateSampleDialog.js";
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

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {
    LocalizationProvider,
    DatePicker
} from '@mui/x-date-pickers/';


function StyleSamples( props ){

    return(
        <>
            <Grid container>
                <CreateSampleDialog 
                    {...props}
                />
            </Grid>
        </>
    )
}

export default StyleSamples;