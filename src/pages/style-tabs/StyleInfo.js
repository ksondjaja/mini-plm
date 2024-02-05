import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { 
    StyleAttribute
} from "core";
import {
    Grid,
    TextField,
    Select,
    MenuItem,
    Box,
    Typography,
    Button
} from '@mui/material';


function StyleInfo( props ){

    const { styleDetails, token } = props;
    const [editMode, setEditMode] = useState(false);

    const BACKEND_URL_STYLES = process.env.REACT_APP_BACKEND_URL_STYLES;
    const navigate = useNavigate()



    const deleteStyle = async (styleid) => {

        const StyleId= JSON.stringify(styleid);

        console.log(StyleId);

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

            navigate('/home');
        }catch(err){
            console.log('Error: ' + JSON.stringify(err.message));
        }
    }

    const handleDeleteStyle = event => {
        event.preventDefault();

        //In popup, ask user to confirm. Then show feedback message that style has been deleted.

        deleteStyle(styleDetails.StyleId);
    }

    return(
        <>
            <Grid container mb={3}>
                <Grid item xs={6} justifyContent="flex-start">
                    {!editMode&&
                        <Button color="primary" variant="contained">
                            Print QR Tag
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
                        <Button color="primary" variant="contained" sx={{mx: 2}} onClick={()=>setEditMode(false)}>
                            Done Editing
                        </Button>
                        <Button color="error" variant="contained" sx={{mx: 2}} onClick={handleDeleteStyle}>
                            Delete Style
                        </Button>
                    </>   
                    }
                </Grid>
            </Grid>


            <Grid container display="flex" justifyContent="stretch" spacing={2}>
                <Grid item sm={6}>
                    <Box sx={{ height: "100%", bgcolor: "black"}}>

                    </Box>
                </Grid>
                <Grid item sm={6}>
                    <Grid container>

                        <Grid item xs={12}>
                            {!editMode?
                                <Typography variant="body1" color="primary">
                                    {styleDetails.Season}   {styleDetails.DeliveryDate? JSON.stringify(styleDetails.DeliveryDate).slice(1,5) : ''} - <b>{styleDetails.Category}</b>
                                </Typography>
                            :
                            <Grid container>
                                <Grid item xs={4}>
                                    <StyleAttribute
                                        textSize="20px"
                                        textColor="#1976d2"
                                        attribute="Season"
                                        selectCat="seasons"
                                        text={styleDetails.Season}
                                        select
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <StyleAttribute
                                        textSize="20px"
                                        textColor="#1976d2"
                                        attribute="Delivery Year"
                                        text={styleDetails.DeliveryDate? JSON.stringify(styleDetails.DeliveryDate).slice(1,5) : ''}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <StyleAttribute
                                    textSize="20px"
                                    textColor="#1976d2"
                                    attribute="Category"
                                    selectCat="categories"
                                    text={styleDetails.Category}
                                    select
                                    />             
                                </Grid>
                            </Grid>
                            }
                        </Grid>

                        <Grid item xs={12}>
                            {!editMode?
                                <Typography variant="h4" color="primary">
                                    <b>{styleDetails.StyleName}</b>
                                </Typography>
                            :
                                <StyleAttribute
                                textSize="24px"
                                textColor="#1976d2"
                                attribute="Style Name"
                                text={styleDetails.StyleName}
                                bold
                                />
                            }
                        </Grid>

                        <Grid item xs={12} mb={2}>
                            <Typography variant="body1" color="#1976d2">
                                Style ID: <b>{styleDetails.StyleId}</b>
                            </Typography>
                        </Grid>
                        
                        
                        {!editMode?
                            <Grid item xs={12}>
                                <Typography variant="body1" color="black">
                                    Commodity Type: <b>{styleDetails.FabricType} {styleDetails.Commodity}</b>
                                </Typography>
                            </Grid>
                            :
                            <>
                                <Grid item xs={6}>
                                    <StyleAttribute
                                        textSize="16px"
                                        textColor="#1976d2"
                                        attribute="FabricType"
                                        selectCat="fabricTypes"
                                        text={styleDetails.FabricType}
                                        bold
                                        select
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <StyleAttribute
                                        textSize="16px"
                                        textColor="#1976d2"
                                        attribute="Silhouette"
                                        selectCat="silhouettes"
                                        text={styleDetails.Silhouette}
                                        bold
                                        select
                                    />
                                </Grid>
                            </>
                            }
                        </Grid>
                        
                        <Grid container>
                            {!editMode?
                                <Grid item xs={12}>
                                    <Typography variant="body1" color="black">
                                        Silhouette: <b>{styleDetails.Silhouette}</b>
                                    </Typography>
                                </Grid>
                                :
                                <Grid item xs={6} mt={2}>
                                    <StyleAttribute
                                        textSize="16px"
                                        textColor="#1976d2"
                                        attribute="Commodity"
                                        selectCat="commodities"
                                        text={styleDetails.Commodity}
                                        bold
                                        select
                                    />
                                </Grid>
                            }
                            </Grid>
                        
                            <Grid container>
                            {!editMode?
                                <Grid item xs={12}>
                                    <Typography variant="body1" color="black">
                                        Size Range: <b>{styleDetails.SizeRange}</b>
                                    </Typography>
                                </Grid>
                                :
                                <Grid item xs={6} mt={2}>
                                    <StyleAttribute
                                        textSize="16px"
                                        textColor="black"
                                        attribute="SizeRange"
                                        selectCat="sizes"
                                        text={styleDetails.SizeRange}
                                        select
                                    />
                                </Grid>
                            }
                            </Grid>

                            {!editMode?
                                <Grid item xs={12} mt={2}>
                                    <Typography variant="body1" color="black">
                                        Vendor: <b>{styleDetails.Vendor}</b>
                                    </Typography>
                                </Grid>
                                :
                                <Grid item xs={6} mt={3}>
                                    <StyleAttribute
                                        textSize="16px"
                                        textColor="black"
                                        attribute="Vendor"
                                        selectCat="vendors"
                                        text={styleDetails.Vendor?? ''}
                                        select
                                    />
                                </Grid>
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
        </>
    )

}

export default StyleInfo;