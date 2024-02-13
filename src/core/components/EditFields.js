import React from "react";
import { useState } from 'react';
import {
    Box,
    Typography,
    MenuItem,
    TextField,
    InputAdornment,
    IconButton
 } from '@mui/material';
 import {
    Check
} from '@mui/icons-material';
import SelectData from '../../data/SelectData';

export const StyleAttribute = props => {

    const cat = SelectData[props.selectCat];

    const [focused, setFocused] = useState(false);
    //const [newValue, setNewValue] = useState(null);

    const handleFocus = event => {
        event.preventDefault();
        setFocused(true);
    }

    const handleBlur = event => {
        event.preventDefault();
        //setNewValue(null);
        setFocused(false);
    }

    // const handleInputChange = event => {
    //     const value = event.target.value
    //     setNewValue(value);
    // }

    // const handleSaveEdit = event => {
    //     event.preventDefault();
    // }

    return (
    <Box px={1}>
        <TextField
            variant="standard"
            label={props.attribute}
            name={props.attribute}
            value={props.text}
            //onChange={handleInputChange}
            // helperText={focused && "Click checkmark to save"}
            select={props.select? true : false}
            InputProps={{
                style: {fontSize: props.textSize, color:props.textColor, fontWeight: (props.bold? 'bold' : 'normal')},
                // endAdornment: (
                // <InputAdornment position="end" sx={{ marginRight: "-30px" }}>
                //     {focused &&
                //         <IconButton color="success">
                //             <Check/>
                //         </IconButton>
                //     }
                // </InputAdornment>
                // )
            }}
            // sx={ props.select && {width: focused? "75%": "80%"}}
            fullWidth
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
        >
            {props.select && 
            
                cat.map((c, i)=>(
                <MenuItem key={i} value={c}>
                    {c}
                </MenuItem>
                ))
            }
        </TextField>
    </Box>
)}