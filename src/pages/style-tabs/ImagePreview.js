import { useState, useEffect } from 'react';
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
    CardMedia,
    IconButton
} from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {
    LocalizationProvider,
    DatePicker
} from '@mui/x-date-pickers/';
import UploadImageDialog from './UploadImageDialog';
import OpenInNew from '@mui/icons-material/OpenInNew';


function ImagePreview( props ){

    const { styleImages, imagesInfo, imageLoading, setOpenUploadDialog } = props;

    const [displayedImage, setDisplayedImage] = useState((Object.keys(styleImages).length>0) ? 0 : null)

    return(
        <>
        {Object.keys(styleImages).length>0 && !imageLoading &&

            <>
            <Box sx={{ border: '1px solid black', pb: 4, mb:2}}>
                <Box
                    display = 'block'
                    position = 'relative'
                    justifyContent='center'
                    sx={{ maxHeight: '100%', paddingBottom: '50%'}}
                >
                    <CardMedia
                        component={"img"}
                        src={styleImages[displayedImage]}
                        sx={{ position: 'absolute',
                            left: -2, top: 0,
                            p:2, height: '100%', objectFit: 'contain'
                        }}
                    />

                    <Box
                        sx={{ height: '100%', width: '100%', pb:4, position: 'absolute', left: 0, top:0,
                            backgroundColor: 'black', opacity: '0%', objectFit: 'contain',
                            transition: '0.2s', ':hover': { opacity: '50%'}
                        }}
                    >
                        <Box sx={{ p:2, width: '100%',
                            display: 'flex', flexDirection: 'column',
                            textWrap: 'wrap', overflowWrap: 'break-word'}}
                        >
                            <IconButton color="primary" sx={{ position: 'absolute', top: 1, right: 1}}>
                                <OpenInNew fontSize="small"/>
                            </IconButton>

                            <Box sx={{ backgroundColor: '#1976d2', width: 'max-content', px:1, my:2 }}>
                                <Typography variant="body1" color="white">
                                    <b>{imagesInfo[displayedImage].Tag}</b>
                                </Typography>
                            </Box>

                            <Typography variant="h5" color="white">
                                {imagesInfo[displayedImage].Title}
                            </Typography>
                            
                            <Typography variant="body1" color="white">
                                Notes: {imagesInfo[displayedImage].Notes}
                            </Typography>
                            
                            
                        </Box>
                    </Box>

                </Box>
            </Box>
            <Grid container spacing={4} mb={5} pr={2}
                display="flex" flexDirection="row" justifyContent="stretch" alignItems="stretch" 
                sx={{height: '100%'}}
            >
                {styleImages.map((image, i)=>
                    <Grid item sm={3} key={i}>
                        <Box
                        display = 'block'
                        position = 'relative'
                        sx={{ paddingBottom: '100%'}}
                        >
                        <CardMedia
                            component={"img"}
                            src={image}
                            sx={{ position: 'absolute',
                                left: 0, top: 0,
                                p: 1, height: '100%', objectFit: 'contain',
                                border: i===displayedImage? '3px #1976d2 solid' : '1px black solid'
                            }}
                            onClick={()=>setDisplayedImage(i)}
                        />
                        </Box>
                    </Grid>
                )}
                <Grid item sm={3}>
                        <Box
                        display = 'block'
                        position = 'relative'
                        sx={{ paddingBottom: '100%'}}
                        >
                            <Button variant="contained" component="span"
                                sx={{ textAlign: 'center', position: 'absolute', left: 0, top: 0,
                                    height: '115%', width: '115%', objectFit: 'contain'
                                }}
                                onClick={()=>setOpenUploadDialog(true)}
                            >
                                Upload Image
                            </Button>
                        </Box>
                </Grid>
            </Grid>
            </>
        }

        {Object.keys(styleImages).length===0 &&
        <>
            <Box sx={{ height: "100%", bgcolor: "black", mb: 2}} />

            <Box>
                <Button variant="contained" component="span" onClick={()=>setOpenUploadDialog(true)}>
                    Upload Image
                </Button>
            </Box>
        </>
        }
        </>
    )
}

export default ImagePreview