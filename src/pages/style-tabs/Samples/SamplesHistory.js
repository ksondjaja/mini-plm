import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import dayjs from 'dayjs';
import CreateSampleDialog from "./CreateSampleDialog";
import { 
    StyleAttribute
} from "core";
import {
    Grid,
    TextField,
    Typography,
    Button,
    Dialog,
    DialogContent,
    FormControlLabel,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio
} from '@mui/material';


function SamplesHistory( props ){

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

export default SamplesHistory;