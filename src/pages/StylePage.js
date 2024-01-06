import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { 
    Layout,
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


function StylePage( props ) {

    const { currentStyle, token } = props;
    const styleDetails = currentStyle["Item"];

    const [editMode, setEditMode] = useState(false);

    const BACKEND_URL_STYLES = process.env.REACT_APP_BACKEND_URL_STYLES;
    const navigate = useNavigate()
    const controller = new AbortController();


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

    useEffect(()=>{
        return() => controller.abort();
    }, [token]);

    return(
        <Layout>
            {props.currentStyle && props.token &&
                <>
                <Grid container mb={3} justifyContent="flex-end">
                    <Grid item xs={2}>
                        {!editMode?
                            <Button color="primary" variant="contained" onClick={()=>setEditMode(true)}>
                                Edit Info
                            </Button>    
                        :    
                            <Button color="primary" variant="outlined" onClick={()=>setEditMode(false)}>
                                Done Editing
                            </Button>   
                        }
                    </Grid>
                    <Grid item xs={2}>
                        <Button color="error" variant="contained" onClick={handleDeleteStyle}>
                            Delete Style
                        </Button>
                    </Grid>
                </Grid>
                <Grid container mb={2}>
                    {!editMode?
                        <Typography variant="h6" color="primary">
                            {styleDetails.Category}   {styleDetails.Season}   {styleDetails.DeliveryDate? JSON.stringify(styleDetails.DeliveryDate).slice(1,5) : ''}
                        </Typography>
                    :<>
                        <Grid item xs={3}>
                            <StyleAttribute
                            textSize="20px"
                            textColor="#1976d2"
                            attribute="Category"
                            selectCat="categories"
                            text={styleDetails.Category}
                            select
                            />             
                        </Grid>
                        <Grid item xs={3}>
                            <StyleAttribute
                                textSize="20px"
                                textColor="#1976d2"
                                attribute="Season"
                                selectCat="seasons"
                                text={styleDetails.Season}
                                select
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <StyleAttribute
                                textSize="20px"
                                textColor="#1976d2"
                                attribute="Delivery Year"
                                text={styleDetails.DeliveryDate? JSON.stringify(styleDetails.DeliveryDate).slice(1,5) : ''}
                            />
                        </Grid>
                    </>
                    }
                </Grid>
                <Grid container>
                    <Grid item xs={3}>
                        {!editMode?
                            <Typography variant="h5" color="primary">
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
                        <Typography variant="body1" color="#1976d2" sx={{padding: 1}}>
                            Style ID: {styleDetails.StyleId}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container my={3}>
                    
                        {!editMode?
                        <>
                        <Grid item xs={4}>
                            <Typography variant="body1" color="primary">
                                <b>{styleDetails.FabricType} {styleDetails.Silhouette} {styleDetails.Commodity}</b>
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="body1" color="black">
                                Size Range: {styleDetails.SizeRange}
                            </Typography>
                        </Grid>
                        </>
                        :
                        <>
                        <Grid item xs={2}>
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
                        <Grid item xs={2}>
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
                        <Grid item xs={2}>
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
                        <Grid item xs={2}>
                            <StyleAttribute
                                textSize="16px"
                                textColor="black"
                                attribute="SizeRange"
                                selectCat="sizes"
                                text={styleDetails.SizeRange}
                                select
                            />
                        </Grid>
                        </>
                        }
                </Grid>
                </> 
            }
            
        </Layout>
    )
}

export default StylePage;