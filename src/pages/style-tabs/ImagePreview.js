import { useState } from 'react';
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
    IconButton,
    SvgIcon
} from '@mui/material';
import UploadImageDialog from './UploadImageDialog';
import OpenInNew from '@mui/icons-material/OpenInNew';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import Panorama from '@mui/icons-material/Panorama';


function ImagePreview( props ){

    const { styleImages, imagesInfo, imageLoading, setOpenUploadDialog } = props;

    const imgCount = Object.keys(styleImages).length;
    let previewGroups = [];

    if(imgCount > 0){
        const groups = Math.ceil(imgCount/4);
        const remainder = imgCount%4;

        const groupsOfFour = remainder>0 ? groups-1 : groups

        for(let i=0; i<(groupsOfFour); i++){
            previewGroups.push([])
            for(let n=0; n<4; n++){
                previewGroups[i].push(styleImages[n+(4*i)])
            }
        }

        if(remainder>0){
            previewGroups.push([])
            for(let n=0; n<remainder; n++){
                previewGroups[groupsOfFour].push(styleImages[n+(4*(groupsOfFour))])
            }
        }

        //console.log('previewGroups:'+ previewGroups)
    }


    const [displayed, setDisplayed] = useState((imgCount > 0) ? 0 : null)
    const [previewed, setPreviewed] = useState((imgCount > 0) ? 0 : null)

    return(
        <>
        {imgCount>0 && !imageLoading &&

        <>
            <Box sx={{ border: '1px solid black', pb: 4, mb:2}}>
                <Box
                    display = 'block'
                    position = 'relative'
                    justifyContent='center'
                    sx={{ maxHeight: '100%', paddingBottom: '50%'}}
                >
                    {previewed < previewGroups.length ?
                    <>
                    <CardMedia
                        component={"img"}
                        src={previewGroups[previewed][displayed]}
                        sx={{ position: 'absolute',
                            left: 0, top: 0,
                            pt:2, height: '100%', width: '100%', objectFit: 'contain'
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
                                    <b>{imagesInfo[displayed+(4*previewed)].Tag}</b>
                                </Typography>
                            </Box>

                            <Typography variant="h5" color="white">
                                {imagesInfo[displayed+(4*previewed)].Title}
                            </Typography>
                            
                            <Typography variant="body1" color="white">
                                Notes: {imagesInfo[displayed+(4*previewed)].Notes}
                            </Typography>
                            
                            
                        </Box>
                    </Box>
                    </>
                    :
                    <CardMedia sx={{ display: 'flex', flexDirection: 'column', justifyContent:'center', alignItems: 'center',
                        position: 'absolute', left: 0, top: 0,
                        height: '100%', width: '100%', objectFit: 'contain',
                        opacity: '50%'
                    }}>
                        <SvgIcon component={Panorama} sx={{ fontSize: '100px'}}/>
                        <Typography variant="h4" sx={{ textAlign: 'center' }}>
                            Upload an Image
                        </Typography>
                    </CardMedia>
                    }

                    

                </Box>
            </Box>
            <Box sx={{ width: '100%', height: '100%'}}>
            <Grid container spacing={2} sx={{ width: '100%' }} display="flex" flexDirection="row" justify="space-between" justifyContent="stretch" alignItems="center" >
                <Grid item xs={1} display="flex" justifyContent="flex-start" sx={{ height: '100%' }}>
                    <IconButton
                        sx={{ display: previewed>0?'flex': 'none'}}
                        onClick={()=>{
                            setPreviewed(previewed-1)
                            setDisplayed(0)
                        }}
                    >
                        <ArrowBackIos sx={{display: 'flex', textAlign: 'center' }}/>
                    </IconButton>
                </Grid>
                <Grid item xs={10}>
                    <Box sx={{ width: '100%', height: '100%'}}>
                        <Grid container spacing={4} mb={2}
                            display="flex" flexDirection="row" justify="space-between" justifyContent="stretch" alignItems="center" 
                            sx={{height: '100%', }}
                        >
                                {previewed < previewGroups.length &&
                                previewGroups[previewed].map((image, i)=>
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
                                                border: i===displayed? '3px #1976d2 solid' : '1px black solid'
                                            }}
                                            onClick={()=>{
                                                setDisplayed(i)
                                            }}
                                        />
                                        </Box>
                                    </Grid>
                                )}
                            { ((previewed === (previewGroups.length-1) && previewGroups[previewed].length<4) ||
                                previewed === previewGroups.length
                            )&&
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
                            }
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs={1} display="flex" justifyContent="flex-start" sx={{ height: '100%' }}>
                    <IconButton
                        sx={{ display: (previewed<(previewGroups.length-1)) ||
                            (previewed===(previewGroups.length-1) && previewGroups[previewGroups.length-1].length===4) ?
                            'flex': 'none'}}
                        onClick={()=>{
                            setPreviewed(previewed+1)
                            setDisplayed(0)
                        }}
                    >
                        <ArrowForwardIos sx={{display: 'flex', textAlign: 'center' }}/>
                    </IconButton>
                </Grid>
            </Grid>
            </Box>
            </>
        }

        {imgCount===0 &&
        <>
            <Box sx={{ border: '1px solid black', pb: 4, mb:2}}>
                <Box
                    display = 'block'
                    position = 'relative'
                    justifyContent='center'
                    sx={{ maxHeight: '100%', paddingBottom: '50%'}}
                >
                    <CardMedia sx={{ display: 'flex', flexDirection: 'column', justifyContent:'center', alignItems: 'center',
                        position: 'absolute', left: 0, top: 0,
                        height: '100%', width: '100%', objectFit: 'contain',
                        opacity: '50%'
                    }}>
                        <SvgIcon component={Panorama} sx={{ fontSize: '100px'}}/>
                        <Typography variant="h4" sx={{ textAlign: 'center' }}>
                            Upload an Image
                        </Typography>
                    </CardMedia>
                </Box>
            </Box>

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