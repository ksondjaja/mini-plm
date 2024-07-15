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
    DialogContent,
    TextField,
    MenuItem
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
        imagesInfo,
        setImagesInfo,
        handleFileUpload } = props;

    const imageTags = ["Design Sketch", "Colors", "Graphic", "Material", "Construction", "Reference"]

    const [previewImages, setPreviewImages] = useState([]);

    const handleImageInfoChange = event => {
        const value = event.target.value
  
        setImagesInfo({
          ...imagesInfo,
        [event.target.name]: value
        });
    }

    const handleFileSelect = (event) => {

        //How to preview & upload multiple files using File Reader?

        const file = event.target.files[0];

        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
            setPreviewImages(fileReader.result);
        });
        fileReader.readAsDataURL(file);

        setFilesToUpload(file)

        setImagesInfo({
            ImageTitle: file.name
        })

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

                    <Grid container spacing={2} display="flex" justifyContent="center">
                    {/* Preview & Upload only 1 file */}
                    {filesToUpload !== null && previewImages &&
                        <Grid item xs={4}>
                                <img src={previewImages} alt="preview-image" style={{ width: '100%'}}/>
                                <Typography variant="body1" sx={{ my: 2 }}>
                                    File Name: {filesToUpload.name}<br/>
                                    File Type: {filesToUpload.type}<br/>
                                </Typography>
                                <Box>
                                    <TextField
                                        id="image-title"
                                        label="Title"
                                        name="ImageTitle"
                                        value={imagesInfo.ImageTitle?? ''}
                                        onChange={handleImageInfoChange}
                                        fullWidth
                                        sx={{mb: 2}}
                                        required
                                    />

                                    <TextField
                                        labelId="select-image-tag"
                                        id="image-tag"
                                        value={imagesInfo.ImageTag?? imageTags[0]}
                                        label="Tag"
                                        name="ImageTag"
                                        onChange={handleImageInfoChange}
                                        select
                                        fullWidth
                                        sx={{mb: 2, textAlign: 'left'}}
                                    >
                                        {imageTags.map((tag, i)=>(
                                            <MenuItem key={i} value={tag}>
                                                {tag}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    <TextField
                                        id="image-notes"
                                        label="Notes"
                                        name="ImageNotes"
                                        value={imagesInfo.ImageNotes?? ''}
                                        onChange={handleImageInfoChange}
                                        fullWidth
                                        multiline
                                        rows={2}
                                        sx={{mb: 2}}
                                    />  
                                </Box>
                        </Grid>  
                    }
                    </Grid>
                    
                    <Box sx={{ mt: 3}}>
                            <input
                                name="image"
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="upload-file-button"
                                multiple
                                type="file"
                                onChange={handleFileSelect}
                            />
                            <Box display="flex" flexDirection="row" justifyContent="center">
                                <label htmlFor="upload-file-button">
                                    {filesToUpload === null ? 
                                        <Button variant="contained" component="span">
                                            Select Image File
                                        </Button>
                                    :
                                        
                                        <Button variant="outlined" component="span" sx={{ mx: 5}}>
                                            Change Image File
                                        </Button>
                                    }
                                </label>
                                <Button variant="contained" sx={{ mx: 5}} onClick={handleFileUpload}>
                                    Upload File
                                </Button>
                            </Box>
                    </Box>
                </DialogContent>
            </Box>
        </Dialog>
    )
}

export default UploadImageDialog;
