import React, { useState } from 'react';
import dayjs from 'dayjs';
import {
    Box,
    Typography,
    MenuItem,
    TextField,
    InputAdornment,
    IconButton,
 } from '@mui/material';
 import {
    Check
} from '@mui/icons-material';
import SelectData from '../../data/SelectData';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {
    LocalizationProvider,
    DatePicker
} from '@mui/x-date-pickers/';


export const HasDateInput = props => {

    // How to replace "enter date" item with saved date if date exists? 

    const [hasDate, setHasDate] = useState(props.inputData==='none'? false: true)
    const [inputValue, setInputValue] = useState(props.inputData==='none' ? 'none': props.inputData)

    const handleAddDate = event => {
        const value = event.target.value;

        if(value==="has date"){
            setHasDate(true)
            setInputValue('has date')
        }else{
            setHasDate(false)
            setInputValue('none')
        }
    }

    return(
        <Box display="flex" flexDirection="column" my={2}>
            <TextField
                select="true"
                value={inputValue}
                label={props.inputLabel}
                name={props.input}
                onChange={handleAddDate}
                sx={{ width: '200px' }}
                {...props}
            >
                <MenuItem value={'none'}>not yet</MenuItem>
                <MenuItem value={'has date'}>enter date</MenuItem>
            </TextField>

            {hasDate &&
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                        <DatePicker
                            id={'date-'+ (props.input)}
                            label={(props.inputLabel)+' Date'}
                            name={'date-'+ (props.input)}
                            views={['year', 'month', 'day']}
                            value={dayjs(inputValue) ?? dayjs()}
                            onChange={props.dateOnChange}
                            {...props}
                        />
                    </DemoContainer>
                </LocalizationProvider>
            }
        </Box>
    )
    
}

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