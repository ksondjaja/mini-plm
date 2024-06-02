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

    const { BACKEND_URL_STYLES, styleid, token } = props;

    const sampleLinks = ['History', 'Specs', 'Grading'];

    const [sampleTab, setSampleTab] = useState('History');

    const [samples, setSamples] = useState([]);
    const sampleCount = samples.length
    const [WO, setWO] = useState("SMS");

    const [currentSample, setCurrentSample] = useState();
    const [tableData, setTableData] = useState();
    const [rowCount, setRowCount] = useState()

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
        }catch(err){
            console.log('Error: ' + JSON.stringify(err.message));
        }finally{
            setLoading(false);
        }
    }

    const fetchSpecs = async (style, token) =>{
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

          const specs = (res.data)["Item"]["StyleSpecs"]
    
          setTableData(specs);
          //setCurrentSample(specs.length);
          setRowCount(specs[0]["StyleSpecs"].length);
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

    const createSampleSpec = (item) => {
        const specRowCount = item.samples.length;

        for(let i=0; i<specRowCount; i++){
            item.push({
                id:i+1,
                type: WO,
                vdr: null,
                bo: null,
                rev: null
            })
        }
    }

    const handleCreateSample = () => {

        fetchSpecs(Style);

        const newTable = tableData.forEach(createSampleSpec)
        console.log(newTable);

        const WOInfo = {
            StyleId: styleid,
            SampleInfo:[{
                id: sampleCount + 1,
                SampleType: WO,
                DateCreated: Date.now(),
                SampleReceived: null,
            }],
            UpdatedStyleSpecs: newTable
        }

        submitCreateSample(WOInfo);        
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

            {sampleTab==='History' && !loading &&
                <Grid container spacing={2}>
                    {(samples.length>0)&&
                    samples.map((s,i)=>(
                        <Grid item xs={2} key={i}>
                            <Typography variant="body1" color="black">
                            {s.SampleType}
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
                <SampleSpecs
                    token = {token}
                    styleid = {styleid}
                    fetchSamples = {fetchSamples}
                    BACKEND_URL_STYLES = {BACKEND_URL_STYLES}
                    {...props}
                />
            }
            
        </>
    )
}

export default StyleSamples;