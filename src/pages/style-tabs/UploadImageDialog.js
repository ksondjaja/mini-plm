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
    //https://stackoverflow.com/questions/74536534/react-js-how-to-upload-image-with-preview-and-display-the-processe-image

    const { openUploadDialog,
        setOpenUploadDialog,
        filesToUpload,
        setFilesToUpload,
        imagesToUpload,
        setImagesToUpload,
        submitFileUpload } = props;

    const [previewImages, setPreviewImages] = useState([]);

    const handleFileSelect = (event) => {

        //How to preview & upload multiple files using File Reader?

        const file = event.target.files[0];
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
            setPreviewImages(fileReader.result);
        });
        fileReader.readAsDataURL(file);

        console.log(file);

        setFilesToUpload(file)

        // let fileObject = []
        // let fileReaders = []
        // let images = []
        // let isCancel = false;

        // fileObject.push(event.target.files)
        // setFilesToUpload(event.target.files)

        // console.log(fileObject[0]);

        // for(const [key, value] of Object.entries(fileObject[0])) {
        //     const fileReader = new FileReader();
        //     fileReaders.push(fileReader);
        //     fileReader.onload = (e) => {
        //       const { result } = e.target;
        //       if (result) {
        //         images.push(result)
        //       }
        //     }
        //     fileReader.readAsDataURL(value);
        // }

        // setImagesToUpload(images);

        // return () => {
        //     isCancel = true;
        //     fileReaders.forEach(fileReader => {
        //       if (fileReader.readyState === 1) {
        //         fileReader.abort()
        //       }
        //     })
        //   }
    }



    return(
        <Dialog
            open = {openUploadDialog}
            onClose={()=>{ setOpenUploadDialog(false) }}
            maxWidth='md'
        >
            <Box p={2} sx={{ display: 'flex', flexDirection: 'column',
                justifyContent: 'stretch', alignItems: 'center', textAlign: 'center' }}
            >
                <DialogTitle>
                    Upload Images from Device
                </DialogTitle>
                <DialogContent>

                    {/* {imagesToUpload!==null &&
                    
                        imagesToUpload.map((file, i)=>{
                            <Box key={i}>
                                <img src={file} alt="preview-image" style={{ width: '30%'}}/>

                                <Typography variant="body1">
                                    <p>
                                        File Name: {filesToUpload[i].name}
                                    </p>
                                    <p>
                                        File Type: {filesToUpload[i].type}
                                    </p>
                                </Typography>
                            </Box>
                        })
                    } */}


                    {/* Preview & Upload only 1 file */}
                    {filesToUpload !== null && previewImages &&
                        <Box>
                            <img src={previewImages} alt="preview-image" style={{ width: '30%'}}/>
                            <Typography variant="body1">
                                File Name: {filesToUpload.name}<br/>
                                File Type: {filesToUpload.type}<br/>
                            </Typography>
                        </Box>  
                     }
                    
                    <Box sx={{ mt: 3}}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="upload-file-button"
                            multiple
                            type="file"
                            onChange={handleFileSelect}
                        />
                        <label htmlFor="upload-file-button">
                            {filesToUpload === null ? 
                                <Button variant="contained" component="span">
                                    Select Image File
                                </Button>
                            :
                                <Box display="flex" flexDirection="row" justifyContent="center">
                                    <Button variant="outlined" component="span" sx={{ mx: 5}}>
                                        Change Image File
                                    </Button>

                                    <Button variant="contained" sx={{ mx: 5}} onClick={submitFileUpload}>
                                        Upload File
                                    </Button>

                                </Box>
                            }
                            
                        </label>
                    </Box>
                </DialogContent>
            </Box>
        </Dialog>
    )
}

export default UploadImageDialog;
