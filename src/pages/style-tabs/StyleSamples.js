import { useEffect, useState } from 'react';
import moment from 'moment';
import CreateSampleDialog from "./CreateSampleDialog.js";
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

    const controller = new AbortController();

    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);

    const { BACKEND_URL_STYLES,
        styleid,
        token,
        fetchSpecs,
        fetchSamples,
        submitCreateSample,
        samples,
        setSamples,
        sampleCount,
        setSampleCount,
        WO,
        setWO
      } = props;

    
    const handleCreateSample = async(WO, token) => {

        // Get currently existing specs inside tableData state
        const tableData = await fetchSpecs({
                        StyleId: styleid,
                        Attributes: "StyleSpecs"
                    }, token, false);

        // // Inside tableData (all specs), go to each row of spec/POM
        
        console.log('tableData:'+tableData)

        const timestamp = Date.now()
        const splId = `SPL${timestamp}`

        // For each POM row add a new sample msmt
        if (samples){
            let r = 1

            for (const [key, value] of Object.entries(tableData)){
                tableData.samples.splId = {
                    order: r,
                    POMId: key,
                    SampleId: splId,
                    Sample: WO,
                    vdr: null,
                    bo: null,
                    rev: null
                }
                r++;
            }
        }        

        console.log(tableData);

        const WOInfo = {
            StyleId: styleid,
            SampleInfo:{
                id: splId,
                SampleName: WO,
                DateCreated: Date.now(),
                SampleReceived: null,
            },
            UpdatedStyleSpecs: tableData
        }

        submitCreateSample(WOInfo);    
    }

    useEffect(()=>{
        fetchSamples({
            StyleId: styleid,
            Attributes: "StyleSamples"
          }, token, true)
        .then(response => {
            setSamples(Array.from(Object.values(response)));
            setSampleCount(response.length)
        })
        .then(setLoading(false))
        return() => controller.abort();
    }, [token]);

    return(
        <>
        {!loading &&
            <Grid container spacing={2} display="flex" alignItems="center">
                {(samples.length>0) &&
                samples.map((s,i)=>(
                        <Grid item xs={12}
                            md={(12/(samples.length+1))}
                            key={i}
                            display="flex" flexDirection="column" alignItems="center" textAlign="center"
                        >
                            <Typography variant="h6" color="black" sx={{ fontWeight: 'bold' }}>
                                {s.SampleName}
                            </Typography>
                            <Typography variant="body1" color="black">
                                <p>
                                    Spec Created:<br/>
                                    <b>{moment(s.DateCreated).format('MMMM DD YYYY')}</b>
                                </p>
                                <p>
                                    Sample Requested:
                                </p>
                                <p>
                                    Sample Shipped:
                                </p>
                                <p>
                                    Sample Received:<br/>
                                    <b>{s.SampleReceieved ? moment(s.SampleReceived).format('MMMM DD YYYY'): 'not yet'}</b>
                                </p>
                                <p>
                                    Fit Comment Sent:
                                </p>
                            </Typography>

                            {/*
                                Create a Markdown file to write fit comment 
                                Update status when sent/made visible to vendor & change button to "See Comment"
                                Allow to update sample status (enter dates if available)
                            */}

                            <Button variant="contained" color="secondary" sx={{ my: 2 }}>
                                Write Comment
                            </Button>

                            <Button variant="outlined" color="primary" width="auto">
                                Update Info
                            </Button>

                        </Grid>
                ))}
                <Grid item xs={12}
                    md={12/(samples.length+1)}
                    display="flex" justifyContent="center">
                    <CreateSampleDialog
                        handleCreateSample = {handleCreateSample}
                        WO = {WO}
                        setWO = {setWO}
                        token = {token}
                        page = {page}
                        setPage = {setPage}
                        {...props}
                    />
                </Grid>
            </Grid>

        }   
        </>
    )
}

export default StyleSamples;