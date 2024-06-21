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

    const [page, setPage] = useState(0);

    const { BACKEND_URL_STYLES,
        styleid,
        token,
        fetchSpecs,
        fetchSamples,
        submitCreateSample,
        samples,
        getSamples,
        sampleCount,
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
        
        //let specRowCount = tableData.length;
        console.log('POM row count:'+Object.keys(tableData).length)
        console.log('tableData:'+tableData)

        // For each POM row add a new sample msmt
        if (samples.length>0){
            let r = 1

            for (const [key, value] of Object.entries(tableData)){
                tableData.samples.WO = {
                    order: r,
                    POMId: key,
                    SampleId: sampleCount +1,
                    Sample: WO,
                    vdr: null,
                    bo: null,
                    rev: null
                }
                r++;
            }
        }        

        console.log(tableData);

        const timestamp = Date.now()

        const WOInfo = {
            StyleId: styleid,
            SampleInfo:{
                id: `SPL${timestamp}`,
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
        .then(response => StyleSamples(Array.from(Object.values(response)).reverse()))
        return() => controller.abort();
    }, [token]);

    return(
        <>
            <Grid container spacing={2} display="flex" alignItems="center">
                {(samples.length>0) &&
                samples.map((s,i)=>(
                        <Grid item xs={12} md={(12/(samples.length+1))} key={i}
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
                <Grid item xs={12} md={12/(samples.length+1)} display="flex" justifyContent="center">
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

                
        </>
    )
}

export default StyleSamples;