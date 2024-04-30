import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import moment from 'moment';
import CreateSampleDialog from "./SamplePages/CreateSampleDialog.js";
import SampleSpecs from "./SamplePages/SampleSpecs";
import { 
    StyleMenu
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

    const sampleLinks = ['History', 'Specs', 'Grading']

    const [sampleTab, setSampleTab] = useState('History')

    const [samples, setSamples] = useState([])
    const [WO, setWO] = useState("SMS");

    const handleCreateSample = (WO) => {

        const WOInfo = {
            id: samples.length + 1,
            WO: WO,
            DateCreated: Date.now(),
            SampleReceived: null,
        }

        setSamples(samples => [...samples, WOInfo])
    }

    return(
        <>
            <StyleMenu
                alignment = 'flex-start'
                styleLinks = {sampleLinks}
                tab = {sampleTab}
                setTab = {setSampleTab}
                {...props}
            />

            {sampleTab==='History' &&
                <Grid container spacing={2}>
                    {(samples.length>0)&&
                    samples.map((s,i)=>(
                        <Grid item xs={2} key={i}>
                            <Typography variant="body1" color="black">
                            {s.WO}
                            <br/>
                            Spec Created: {moment(s.DateCreated).format('MMMM DD YYYY')}
                            <br/>
                            Sample Received: {s.SampleReceieved ? moment(s.SampleReceived).format('MMMM DD YYYY'): 'not yet'}
                            </Typography>
                        </Grid>
                    ))}
                    <Grid item xs={2}>
                        <CreateSampleDialog
                            handleCreateSample = {handleCreateSample}
                            WO = {WO}
                            setWO = {setWO} 
                            {...props}
                        />
                    </Grid>
                </Grid>
            }

            { sampleTab==='Specs' &&
                <SampleSpecs/>
            }
            
        </>
    )
}

export default StyleSamples;