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
    const [sampleCount, setSampleCount] = useState();
    const [WO, setWO] = useState("SMS");

    const [currentSample, setCurrentSample] = useState();

    const [postResponse, setPostResponse] = useState();
    const [postError, setPostError] = useState();
    const [postLoading, setPostLoading] = useState();

    const [loading, setLoading] = useState(true);
    const [specLoading, setSpecLoading] = useState(true);
    const controller = new AbortController();


    const Style = {
        StyleId: styleid,
        Attributes: "StyleSamples"
    }

    const fetchSamples = async (style, token, runOnLoad) => {
        let spl;
        let splCt;

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

            spl = (res.data)["Item"]["StyleSamples"]
            splCt = (res.data)["Item"]["StyleSamples"].length

            if(runOnLoad){
                setSamples(spl);
                setSampleCount(splCt)
            }
        }catch(err){
            console.log('Error: ' + JSON.stringify(err.message));
        }finally{
            setLoading(false);
            if(!runOnLoad){
                return ([spl, splCt]);
            }
        }
    }

    const fetchSpecs = async (style, token, nested) =>{
        let specs;
    
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
    
          specs = (res.data)["Item"]["StyleSpecs"]
        }catch(err){
            console.log('Error: ' + JSON.stringify(err.message));
        }finally{ 
          if(!nested){
            setSpecLoading(false)
          };
          return (specs);
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
            fetchSamples(Style, token);
            setWO('null');
            setPostLoading(false);
        }
    }

    const handleCreateSample = async(WO, token) => {

        // Get currently existing specs inside tableData state
        const tableData = await fetchSpecs({
                        StyleId: styleid,
                        Attributes: "StyleSpecs"
                    }, token, false);

        // // Inside tableData (all specs), go to each row of spec/POM
        
        let specRowCount = tableData.length;
        console.log('specRowCount:'+specRowCount)
        console.log('tableData:'+tableData)

        for (let r=0; r<specRowCount; r++){
            tableData[r].samples.push({
                id: r+1,
                SampleId: sampleCount+1,
                Sample: WO,
                vdr: null,
                bo: null,
                rev: null
            })
        }

        console.log(tableData);

        const WOInfo = {
            StyleId: styleid,
            SampleInfo:[{
                id: sampleCount + 1,
                SampleType: WO,
                DateCreated: Date.now(),
                SampleReceived: null,
            }],
            UpdatedStyleSpecs: tableData
        }

        submitCreateSample(WOInfo);    
    }

    useEffect(()=>{
        fetchSamples(Style, token, true);
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

                // <p>{JSON.stringify(samples)}</p>
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
                            token = {token}
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
                    fetchSpecs = {fetchSpecs}
                    samples = {samples}
                    sampleCount = {sampleCount}
                    BACKEND_URL_STYLES = {BACKEND_URL_STYLES}
                    {...props}
                />
            }
            
        </>
    )
}

export default StyleSamples;