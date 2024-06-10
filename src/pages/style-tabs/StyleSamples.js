import { useEffect } from 'react';
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


    const Style = {
        StyleId: styleid,
        Attributes: "StyleSamples"
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
            <Grid container spacing={2} display="flex" alignItems="center">
                {(samples.length>0)&&
                samples.map((s,i)=>(
                        <Grid item xs={12} md={(12/(samples.length+1))} key={i}
                            display="flex" flexDirection="column" alignItems="center" textAlign="center"
                        >
                            <Typography variant="h6" color="black" sx={{ fontWeight: 'bold' }}>
                                {s.SampleType}
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
                        {...props}
                    />
                </Grid>
            </Grid>

                
        </>
    )
}

export default StyleSamples;