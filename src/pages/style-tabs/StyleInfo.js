import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import moment from 'moment';
import dayjs from 'dayjs';
import { 
    StyleAttribute
} from "core";
import {
    Grid,
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent
} from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {
    LocalizationProvider,
    DatePicker
} from '@mui/x-date-pickers/';
import UploadImageDialog from './UploadImageDialog';


function StyleInfo( props ){

    const { styleid, styleDetails, token } = props;

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openUploadDialog, setOpenUploadDialog] = useState(false)

    const [fileToUpload, setFileToUpload] = useState(null);

    const [editMode, setEditMode] = useState(false);
    const [editValues, setEditValues] = useState(styleDetails)

    const BACKEND_URL_STYLES = process.env.REACT_APP_BACKEND_URL_STYLES;
    const navigate = useNavigate()
    
    // Handle form change to edit style info
    const handleEditChange = event => {
        const value = event.target.value
  
        setEditValues({
          ...editValues,
        [event.target.name]: value
        });
    }

    const handleEditDatePickerChange = (value, name) => {
        setEditValues({
            ...editValues,
            [name]: value
        })
    }


    // Push edited style info to database
    const submitUpdateStyle = async (styleid) => {

        const StyleId = parseInt(styleid);

        const values = {
            "StyleId": StyleId,
            "StyleInfo": editValues
        }

        try{
            const res = await axios.post(
                (BACKEND_URL_STYLES + `/update/${StyleId}`),
                values,
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            )
            console.log('Response: ' + JSON.stringify(res.data));
            setEditMode(false);
            navigate(0);
        }catch(err){
            console.log('Error: ' + JSON.stringify(err.message));
        }
    }

    // Delete style from database
    const submitDeleteStyle = async (styleid) => {

        const StyleId = parseInt(styleid)

        try{
            const res = await axios.delete(
                (BACKEND_URL_STYLES + `/delete/${StyleId}`),
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            )
            console.log('Response: ' + JSON.stringify(res.data));
            navigate("/home");
        }catch(err){
            console.log('Error: ' + JSON.stringify(err.message));
        }
    }

    // Upload image to S3 bucket
    // Figure out how to upload multiple files & show preview
    const submitFileUpload = async() => {

        const timestamp = Date.now();
        const formData = new FormData();


        //How are the parameters read in the server?
        formData.append(
            `IMG${timestamp}`,
            fileToUpload,
            fileToUpload.name
        );

        console.log(fileToUpload);

        try{
            const res = await axios.post(
                (BACKEND_URL_STYLES + '/uploadFile'),
                formData,
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            )
            console.log('Response: ' + JSON.stringify(res.data));
            setOpenUploadDialog(false)
            navigate(0);
        }catch(err){
            console.log('Error: ' + JSON.stringify(err.message));
        }

    };

    return(
        <>
        <Dialog
            open={openDeleteDialog}
            onClose={()=>{ setOpenDeleteDialog(false) }}
        >
            <Box p={2} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                <DialogTitle>
                    Delete <b>{styleDetails.StyleNumber} {styleDetails.StyleName}</b>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        <p>
                            Are you sure you want to permanently delete all product information & specs related to this style?
                        </p>
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', textAlign: 'center' }}>
                        <Button color="primary" variant="outlined"
                            sx={{ mx: 5 }}
                            onClick={()=>setOpenDeleteDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button color="error" variant="contained"
                            sx={{ mx: 5 }}
                            onClick={()=>submitDeleteStyle(styleid)}
                        >
                            Delete
                        </Button>
                    </Box>
                </DialogContent>
            </Box>
        </Dialog>

        <UploadImageDialog
            openUploadDialog = {openUploadDialog}
            setOpenUploadDialog = {setOpenUploadDialog}
            fileToUpload = {fileToUpload}
            setFileToUpload = {setFileToUpload}
            submitFileUpload = {submitFileUpload}
        />

            <Grid container mb={3}>
                <Grid item xs={6} justifyContent="flex-start">
                    {!editMode ?
                        <Button color="primary" variant="contained">
                            Print QR Tag
                        </Button>
                    :
                        <Button color="error" variant="contained" sx={{mx: 2}} onClick={()=>setOpenDeleteDialog(true)}>
                            Delete Style
                        </Button>
                    }
                </Grid>
                <Grid item xs={6} display="inline-flex" justifyContent="flex-end">
                    {!editMode?
                        <Button color="primary" variant="outlined" sx={{mx: 2}} onClick={()=>setEditMode(true)}>
                            Edit Info
                        </Button>    
                    :    
                    <>
                        <Button color="primary" variant="outlined" sx={{mx: 2}} onClick={()=>setEditMode(false)}>
                            Discard Edits
                        </Button>

                        <Button color="primary" variant="contained" sx={{mx: 2}} onClick={()=>submitUpdateStyle(styleid)}>
                            Save Edits
                        </Button>       
                    </>   
                    }
                </Grid>
            </Grid>


            <Grid container display="flex" justifyContent="stretch" spacing={2}>
                <Grid item sm={6} display="flex" flexDirection="column">
                    <Box sx={{ height: "100%", bgcolor: "black", mb: 2}}>
                        {/* Style Image Here */}
                    </Box>
                    <Box>
                        <Button variant="contained" component="span" onClick={()=>setOpenUploadDialog(true)}>
                            Upload Image
                        </Button>
                    </Box>
                </Grid>

                <Grid item sm={6}>
                    <Grid container>

                        {!editMode?
                        <>
                            <Grid item xs={12}>
                                <Typography variant="body1" color="primary">
                                    {styleDetails.Season}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h4" color="primary">
                                    <b>{styleDetails.StyleName}</b>
                                </Typography>
                            </Grid>

                            <Grid item xs={12} mb={2}>
                                <Typography variant="body1" color="#1976d2">
                                    Style ID: <b>{styleDetails.StyleNumber}</b>
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1" color="black">
                                    Delivery Date: <b>{moment(styleDetails.DeliveryDate.slice(0,10)).format('MMMM DD, YYYY')}</b>
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body1" color="black">
                                    Commodity Type: <b>{styleDetails.FabricType} {styleDetails.Commodity}</b>
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body1" color="black">
                                    Silhouette: <b>{styleDetails.Silhouette}</b>
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body1" color="black">
                                    Size Range: <b>{styleDetails.SizeRange}</b>
                                </Typography>
                            </Grid>

                            <Grid item xs={12} mt={2}>
                                <Typography variant="body1" color="black">
                                    Vendor: <b>{styleDetails.Vendor}</b>
                                </Typography>
                            </Grid>
                        </>
                        :
                        <>
                            <Grid item xs={12}>
                                <Grid container mb={2} display="flex" alignContent="center">
                                    <Grid item xs={6}>
                                        <StyleAttribute
                                            textSize="20px"
                                            textColor="#1976d2"
                                            attribute="Season"
                                            selectCat="seasons"
                                            text={editValues.Season}
                                            select
                                            onChange={handleEditChange}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['DatePicker']}>
                                                <DatePicker
                                                    id="delivery-date"
                                                    label='Delivery Date'
                                                    name='DeliveryDate'
                                                    views={['year', 'month', 'day']}
                                                    value={dayjs(editValues.DeliveryDate) ?? dayjs()}
                                                    onChange={(newDate)=>handleEditDatePickerChange(newDate, 'DeliveryDate')}
                                                    slotProps={{ textField: { variant: "standard" } }}
                                                    fullWidth
                                                    required
                                                />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <StyleAttribute
                                        textSize="20px"
                                        textColor="#1976d2"
                                        attribute="Category"
                                        selectCat="categories"
                                        text={editValues.Category}
                                        select
                                        onChange={handleEditChange}
                                        />             
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <StyleAttribute
                                    textSize="24px"
                                    textColor="#1976d2"
                                    attribute="Style Name"
                                    text={editValues.StyleName}
                                    sx={{ width: '90%'}}
                                    bold
                                    onChange={handleEditChange}
                                />
                            </Grid>

                            <Grid container mt={2} mb={2} display="flex">
                                
                                <Grid item xs={6}>
                                    <StyleAttribute
                                        textSize="16px"
                                        textColor="#1976d2"
                                        attribute="FabricType"
                                        selectCat="fabricTypes"
                                        text={editValues.FabricType}
                                        bold
                                        select
                                        onChange={handleEditChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <StyleAttribute
                                        textSize="16px"
                                        textColor="#1976d2"
                                        attribute="Commodity"
                                        selectCat="commodities"
                                        text={editValues.Commodity}
                                        bold
                                        select
                                        onChange={handleEditChange}
                                    />
                                </Grid>
                            </Grid>
                            
                            <Grid container>
                                <Grid item xs={6}>
                                    <StyleAttribute
                                        textSize="16px"
                                        textColor="#1976d2"
                                        attribute="Silhouette"
                                        selectCat="silhouettes"
                                        text={editValues.Silhouette}
                                        bold
                                        select
                                        onChange={handleEditChange}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container>
                                <Grid item xs={6} mt={2}>
                                    <StyleAttribute
                                        textSize="16px"
                                        textColor="black"
                                        attribute="SizeRange"
                                        selectCat="sizes"
                                        text={editValues.SizeRange}
                                        select
                                        onChange={handleEditChange}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container>
                                <Grid item xs={6} mt={3}>
                                    <StyleAttribute
                                        textSize="16px"
                                        textColor="black"
                                        attribute="Vendor"
                                        selectCat="vendors"
                                        text={editValues.Vendor?? ''}
                                        select
                                        onChange={handleEditChange}
                                    />
                                </Grid>
                            </Grid>
                        </>
                        }

                        
                        
                        {!editMode &&
                        <>
                            <Grid container mt={4}>
                                <Typography variant="body1" color="primary">
                                    <b>STATUS HISTORY</b>
                                </Typography>
                            </Grid>
                            <Grid container mt={4}>
                                <Typography variant="body1" color="primary">
                                    <b>COMMUNICATION</b>
                                </Typography>
                            </Grid>
                        </>
                        }
                    </Grid>
                </Grid>
            </Grid>
        </>
    )

}

export default StyleInfo;