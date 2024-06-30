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

function UploadImageDialog (props){

    //https://www.geeksforgeeks.org/file-uploading-in-react-js/

    const { openUploadDialog, setOpenUploadDialog, fileToUpload, setFileToUpload, submitFileUpload } = props;

    const handleFileChange = (event) => {
        setFileToUpload(event.target.files[0])
    }



    return(
        <Dialog
            open = {openUploadDialog}
            onClose={()=>{ setOpenUploadDialog(false) }}
        >
            <Box p={2} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                <DialogTitle>
                    Upload Image from Device
                </DialogTitle>
                <DialogContent>
                    {fileToUpload !== null &&
                        <Typography variant="body1">
                            <p>
                                File Name: {fileToUpload.name}
                            </p>
                            <p>
                                File Type: {fileToUpload.type}
                            </p>
                        </Typography>
                    }
                    

                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="upload-file-button"
                        multiple
                        type="file"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="upload-file-button">
                        {fileToUpload === null ? 
                            <Button variant="contained" component="span">
                                Select Image File
                            </Button>
                        :
                            <Box display="flex" flexDirection="row">
                                <Button variant="outlined" component="span" sx={{ mx: 5}}>
                                    Change Image File
                                </Button>

                                <Button variant="contained" sx={{ mx: 5}} onClick={submitFileUpload}>
                                    Upload File
                                </Button>

                            </Box>
                        }
                        
                    </label>
                </DialogContent>
            </Box>
        </Dialog>
    )
}

export default UploadImageDialog;
