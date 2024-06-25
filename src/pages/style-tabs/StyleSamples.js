import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import CreateSampleDialog from "./CreateSampleDialog.js";
import { 
    HasDateInput
} from "core";
import {
    Grid,
    Typography,
    Button
} from '@mui/material';


function StyleSamples( props ){

    const controller = new AbortController();
    const navigate = useNavigate();

    const [postResponse, setPostResponse] = useState();
    const [postError, setPostError] = useState();
    const [postLoading, setPostLoading] = useState();

    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);

    const [editMode, setEditMode] = useState(false);
    const [splEditing, setSplEditing] = useState('')
    const [editValues, setEditValues] = useState(null)

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
                SampleRequested: 'none',
                SampleShipped: 'none',
                SampleReceived: 'none',
                FitCommentSent: 'none',
                FitComment: 'none'
            },
            UpdatedStyleSpecs: tableData
        }

        submitCreateSample(WOInfo);    
    }

    const handleEditSample = (splId, i) => {
        setSplEditing(splId)
        setEditMode(true)
        console.log(samples[i])
        setEditValues(samples[i])
    }

    const handleEditDatePickerChange = (value, name) => {
        setEditValues({
            ...editValues,
            [name]: value
        })
    }

    const submitUpdateSample = async (SampleId) => {

        const StyleId = parseInt(styleid);

        console.log(JSON.stringify(editValues));

        const values = {
            "StyleId": StyleId,
            "SampleId": SampleId,
            "SampleInfo": editValues
        }

        try {
            const res = await axios.post(
                (BACKEND_URL_STYLES + '/updateSample'), 
                values,
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            );
            
            console.log(values);
            console.log('Response: ' + JSON.stringify(res.data) );
            setPostResponse(JSON.stringify(res.data));

        } catch(err){
            console.log('Error: ' + JSON.stringify(err.message));
            setPostError(JSON.stringify(err.message));
        } finally {
            navigate(0);
            // how to make sure that tab highlight "Samples" instead of "Overview"?
        }
    }

    const submitDeleteSample = async (SampleId) => {

        const StyleId = parseInt(styleid);

        const values = {
            "StyleId": StyleId,
            "SampleId": SampleId
        }

        try {
            const res = await axios.post(
                (BACKEND_URL_STYLES + '/deleteSample'), 
                values,
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            );
            
            console.log('Response: ' + JSON.stringify(res.data) );
            setPostResponse(JSON.stringify(res.data));

        } catch(err){
            console.log('Error: ' + JSON.stringify(err.message));
            setPostError(JSON.stringify(err.message));
        } finally {
            navigate(0);
            // how to make sure that tab highlight "Samples" instead of "Overview"?
        }
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
                                <Typography variant="body1" color="black" sx={{ mb: 3 }}>
                                    <p>
                                        Spec Created:<br/>
                                        <b>{moment(s.DateCreated).format('MMMM DD, YYYY')}</b>
                                    </p>
                                    {(editMode && splEditing===s.id) ?
                                        <>
                                            <HasDateInput
                                                inputData = {s.SampleRequested}
                                                inputLabel = 'Sample Requested'
                                                input = 'SampleRequested'
                                                dateOnChange = {(newDate)=>handleEditDatePickerChange(newDate, 'SampleRequested')}
                                                slotProps={{ textField: { variant: "standard" } }}
                                                fullwidth
                                            />

                                            <HasDateInput
                                                inputData = {s.SampleShipped}
                                                inputLabel = 'Sample Shipped'
                                                input = 'SampleShipped'
                                                dateOnChange = {(newDate)=>handleEditDatePickerChange(newDate, 'SampleShipped')}
                                                slotProps={{ textField: { variant: "standard" } }}
                                                fullwidth
                                            />

                                            <HasDateInput
                                                inputData = {s.SampleReceived}
                                                inputLabel = 'Sample Received'
                                                input = 'SampleReceived'
                                                dateOnChange = {(newDate)=>handleEditDatePickerChange(newDate, 'SampleReceived')}
                                                slotProps={{ textField: { variant: "standard" } }}
                                                fullwidth
                                            />

                                            <HasDateInput
                                                inputData = {s.FitCommentSent}
                                                inputLabel = 'Fit Comment Sent'
                                                input = 'FitCommentSent'
                                                dateOnChange = {(newDate)=>handleEditDatePickerChange(newDate, 'FitCommentSent')}
                                                slotProps={{ textField: { variant: "standard" } }}
                                                fullwidth
                                            />
                                        </>
                                        :
                                        <>
                                        
                                            <p>
                                                Sample Requested:<br/>
                                                <b>{s.SampleRequested !=='none' ? moment(s.SampleRequested.slice(0,10)).format('MMMM DD, YYYY') : 'not yet'}</b>
                                            </p>
                                            <p>
                                                Sample Shipped:<br/>
                                                <b>{s.SampleShipped !=='none' ? moment(s.SampleShipped.slice(0,10)).format('MMMM DD, YYYY') : 'not yet'}</b>
                                            </p>
                                            <p>
                                                Sample Received:<br/>
                                                <b>{s.SampleReceived !=='none' ? moment(s.SampleReceived.slice(0,10)).format('MMMM DD, YYYY') : 'not yet'}</b>
                                            </p>
                                            <p>
                                                Fit Comment Sent:<br/>
                                                <b>{s.FitCommentSent !=='none' ? moment(s.FitCommentSent.slice(0,10)).format('MMMM DD, YYYY') : 'not yet'}</b>
                                            </p>
                                        </>
                                    }
                                </Typography>

                                {/*
                                    Create a Markdown file to write fit comment 
                                    Update status when sent/made visible to vendor & change button to "See Comment"
                                    Allow to update sample status (enter dates if available)
                                */}
                                
                                {(editMode && splEditing===s.id) ? 
                                    <>
                                        <Button color="primary" variant="contained" sx={{my: 1}} onClick={()=>submitUpdateSample(s.id)}>
                                            Save Updates
                                        </Button>  
                                        <Button variant="outlined" color="primary" sx={{my: 1}} onClick={()=>setEditMode(false)}>
                                            Discard Updates
                                        </Button>
                                        <Button color="error" variant="contained" sx={{my: 1}} onClick={()=>submitDeleteSample(s.id)}>
                                            Delete Sample
                                        </Button>
                                    </>
                                    :
                                    <Button variant="outlined" color="primary" width="auto" onClick={()=>handleEditSample(s.id, i)}>
                                        Update Info
                                    </Button>
                                }

                                <Button variant="contained" color="secondary" sx={{ my: 4 }}>
                                    Write Comment
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