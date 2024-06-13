// Figure out how to save Date Picker value to state
// Add other data attributes

import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import dayjs from 'dayjs';
import { Layout } from "core";
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
//import SelectData from './data/SelectData.json';

function CreateStyle( props ) {

    const { token } = props;

    const BACKEND_URL_STYLES = process.env.REACT_APP_BACKEND_URL_STYLES;

    const navigate = useNavigate()

    const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
    const categories = ["Women's", "Men's", "Adult Unisex", "Children's", "Pet's"];
    const commodities = ['Top', 'Bottom', 'Overall/Dress', 'Outerwear', 'Hat', 'Socks', 'Scarf', 'Misc Accessory'];
    const fabricTypes = ['Woven', 'Cut & Sew Knit', 'Sweater Knit', 'Denim'];
    const silhouettes = ['Fitted', 'Slim', 'Classic', 'Relaxed', 'Oversized'];
    const sizes = ["XXS-XXL", "0-14", "16-24", "28-42"]
    const vendors = ["123 Textiles", "XYZ Knits", "789 Denim"]

    const [postResponse, setPostResponse] = useState([]);
    const [postError, setPostError] = useState('');
    const [postLoading, setPostLoading] = useState(true);

    const dateNow = Date.now();

    const [newStyle, setNewStyle] = useState({
        StyleNumber: dateNow,
        Season: seasons[0],
        Category: categories[0],
        Commodity: commodities[0],
        FabricType: fabricTypes[0],
        Silhouette: silhouettes[0],
        SizeRange: sizes[0],
        Vendor: vendors[0]
    });


    const submitStyleData = async (styleData) => {
        try {
            const res = await axios.post(
                (BACKEND_URL_STYLES + '/add'), 
                styleData,
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            );
            
            console.log(styleData);
            console.log('Response: ' + JSON.stringify(res.data) );
            setPostResponse(JSON.stringify(res.data));

        } catch(err){
            console.log('Error: ' + JSON.stringify(err.message));
            setPostError(JSON.stringify(err.message));
        } finally {
            setPostLoading(false);
            setNewStyle('');
            navigate("/home");
        }
    }


    const handleNewStyleChange = event => {
        const value = event.target.value
  
        setNewStyle({
          ...newStyle,
        [event.target.name]: value
        });
    }


    const handleDatePickerChange = (value, name) => {
        setNewStyle({
            ...newStyle,
            [name]: value
        })
    }

    const handleSubmitNewStyle = event => {
        event.preventDefault();

        const styleData = {
            StyleId: dateNow,
            StyleInfo: newStyle,
            StyleSamples: [],
            StyleSpecs: []
        }

        submitStyleData(styleData);
        
    }

    return(
        <Layout>
            <Grid container spacing={3} textAlign="center">
                <Grid ite mb={5}>
                    <Typography variant="h2">
                        Create a New Style
                    </Typography>
                </Grid>
            </Grid>
            <Grid container spacing={3} mb={5} alignContent="flex-end" justifyContent="start">
                <Grid item xs={3}>
                    <TextField
                        labelId="select-season"
                        id="select-season"
                        value={newStyle.Season ?? seasons[0]}
                        label="Season"
                        name="Season"
                        onChange={handleNewStyleChange}
                        select
                        fullWidth
                        required
                    >
                        {seasons.map((season, i)=>(
                            <MenuItem key={i} value={season}>
                                {season}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker
                                id="delivery-date"
                                label='Delivery Date'
                                name='DeliveryDate'
                                views={['year', 'month', 'day']}
                                value={newStyle.DeliveryDate?? dayjs()}
                                onChange={(newDate)=>handleDatePickerChange(newDate, 'DeliveryDate')}
                                fullWidth
                                required
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </Grid>
            </Grid>
            <Grid container spacing={3} mb={5} alignContent="flex-end" justifyContent="start">
                <Grid item xs={3}>
                    <TextField
                        labelId="select-category"
                        id="select-category"
                        value={newStyle.Category ?? categories[0]}
                        label="Category"
                        name="Category"
                        onChange={handleNewStyleChange}
                        select
                        fullWidth
                        required
                    >
                        {categories.map((category, i)=>(
                            <MenuItem key={i} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                
                <Grid item xs={3}>
                    <TextField
                        labelId="select-fabric-type"
                        id="select-fabric-type"
                        value={newStyle.FabricType ?? fabricTypes[0]}
                        label="Fabric Type"
                        name="FabricType"
                        onChange={handleNewStyleChange}
                        select
                        fullWidth
                        required
                    >
                        {fabricTypes.map((fabric, i)=>(
                            <MenuItem key={i} value={fabric}>
                                {fabric}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                
                
            </Grid>
           
            <Grid container spacing={3} mb={5} alignContent="flex-end" justifyContent="start">
                <Grid item xs={3}>
                    <TextField
                        labelId="select-silhouette"
                        id="select-silhouette"
                        value={newStyle.Silhouette ?? silhouettes[0]}
                        label="Silhouette"
                        name="Silhouette"
                        onChange={handleNewStyleChange}
                        select
                        fullWidth
                    >
                        {silhouettes.map((silhouette, i)=>(
                            <MenuItem key={i} value={silhouette}>
                                {silhouette}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        labelId="select-commodity"
                        id="select-commodity"
                        value={newStyle.Commodity ?? commodities[0]}
                        label="Commodity"
                        name="Commodity"
                        onChange={handleNewStyleChange}
                        select
                        fullWidth
                        required
                    >
                        {commodities.map((commodity, i)=>(
                            <MenuItem key={i} value={commodity}>
                                {commodity}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </Grid>
            <Grid container spacing={3} mb={5} alignContent="flex-end" justifyContent="start">
                <Grid item xs={9}>
                    <TextField
                        id="style-name"
                        label="Style Name"
                        name="StyleName"
                        value={newStyle.StyleName?? ''}
                        onChange={handleNewStyleChange}
                        fullWidth
                        required
                    />    
                </Grid>
            </Grid>
            <Grid container spacing={3} mb={5} alignContent="flex-end" justifyContent="start">
                <Grid item xs={4}>
                <TextField
                        labelId="select-size-range"
                        id="select-size-range"
                        value={newStyle.SizeRange ?? sizes[0]}
                        label="Size Range"
                        name="SizeRange"
                        onChange={handleNewStyleChange}
                        select
                        fullWidth
                        required
                    >
                        {sizes.map((size, i)=>(
                            <MenuItem key={i} value={size}>
                                {size}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </Grid>

            <Grid container spacing={3} mb={5} alignContent="flex-end" justifyContent="start">
                <Grid item xs={4}>
                <TextField
                        labelId="select-vendor"
                        id="select-vendor"
                        value={newStyle.Vendor ?? vendors[0]}
                        label="Vendor"
                        name="Vendor"
                        onChange={handleNewStyleChange}
                        select
                        fullWidth
                        required
                    >
                        {vendors.map((vendor, i)=>(
                            <MenuItem key={i} value={vendor}>
                                {vendor}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </Grid>

            <Grid container spacing={3} mb={5} alignContent="flex-end" justifyContent="start">
                <Grid item xs={4}>
                    <Button
                        variant="contained"
                        type="submit"
                        onClick={handleSubmitNewStyle}
                    >
                        Create Style
                    </Button>

                    {postError &&
                        <p>{postError}</p>
                    }
                </Grid>
            </Grid>
        </Layout>
    )
}

export default CreateStyle;