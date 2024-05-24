import { useState, useEffect } from 'react';
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

    const BACKEND_URL_STYLES = process.env.REACT_APP_BACKEND_URL_STYLES;

    const { styleid, token } = props;

    const sampleLinks = ['History', 'Specs', 'Grading'];

    const [sampleTab, setSampleTab] = useState('History');

    const [samples, setSamples] = useState([]);
    const [WO, setWO] = useState("SMS");

    const [postResponse, setPostResponse] = useState();
    const [postError, setPostError] = useState();
    const [postLoading, setPostLoading] = useState();

    const [loading, setLoading] = useState(true);
    const controller = new AbortController();


    const Style = {
        StyleId: styleid,
        Attributes: "StyleSamples"
    }

    const fetchSamples = async (style, token) => {
  
        try{
            const res = await axios.get(
                (BACKEND_URL_STYLES + `/${style.StyleId}`),
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    },
                    params: {
                        attributes: style
                    }
                }
            )
            console.log('Response: ' + JSON.stringify(res.data));

            setSamples((res.data)["Item"]["StyleSamples"])

            console.log(samples);
        }catch(err){
            console.log('Error: ' + JSON.stringify(err.message));
        }finally{
            setLoading(false);
        }
    }

    const submitCreateSample = async (wo) => {
        try {
            const res = await axios.post(
                (BACKEND_URL_STYLES + '/addSample'), 
                wo,
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            );
            
            console.log(wo);
            console.log('Response: ' + JSON.stringify(res.data) );
            setPostResponse(JSON.stringify(res.data));

        } catch(err){
            console.log('Error: ' + JSON.stringify(err.message));
            setPostError(JSON.stringify(err.message));
        } finally {
            setPostLoading(false);
            setWO('null');
            fetchSamples(Style, token);
        }
    }

    const handleCreateSample = () => {

        const WOInfo = {
            StyleId: styleid,
            SampleInfo:[{
                id: samples.length + 1,
                WO: WO,
                DateCreated: Date.now(),
                SampleReceived: null,
                SampleSpecs: {}
            }]
        }

        submitCreateSample(WOInfo);
        //setSamples(samples => [...samples, WOInfo])
        
    }

    useEffect(()=>{
        fetchSamples(Style, token);
        return() => controller.abort();
    }, [token]);

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