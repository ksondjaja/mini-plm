import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import dayjs from 'dayjs';
import SamplesHistory from "./Samples/SamplesHistory";
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
                {/* Toggle between the two pages */}
                <Grid item xs={6}>
                    History
                </Grid>
                <Grid item xs={6}>
                    Specs
                </Grid>
            </Grid>
            {/* Show either History page or Specs page */}

            <SamplesHistory />
        </>
    )
}

export default StyleSamples;