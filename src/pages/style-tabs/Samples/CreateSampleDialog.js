import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import dayjs from 'dayjs';
import { 
    StyleAttribute
} from "core";
import {
    Grid,
    TextField,
    Typography,
    Button,
    Dialog,
    DialogContent,
    FormControlLabel,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio
} from '@mui/material';

function CreateSampleDialog( props ){

    const [showDialog, setShowDialog] = useState(false);
    const [WO, setWO] = useState("SMS");

    const handleOpenDialog = event => {
        setShowDialog(true);
        if(WO.includes("Fit")){
            setWO("Fit");
        }
    }

    const handleRadioChange = event => {
        event.persist();
        setWO(event.target.value);
    }

    const handleClickNext = event => {
        event.preventDefault();

        if(WO==="Fit"){
            setShowDialog(0);

            //Change default Fit number depending on other samples already created
            //Below is to be edited
            setWO("Fit1");
        }else{
            setShowDialog(false);
        }
    }

    const handleChangeFit = event => {
        const num = event.target.value;
        setWO(`Fit${num}`);
    }

    return(
    <>
        {/* <Grid item>
            Dialog: {showDialog.toString()}
            WO: {WO.toString()}
        </Grid> */}
                

        <Grid item>
            <Button color="primary" variant="contained" onClick={handleOpenDialog}>
                Create Sample Specs
            </Button>
        </Grid>
        <Dialog
            open={ showDialog===true }
            onClose={()=>{ setShowDialog(false) }}
        >
            <DialogContent>
                <Grid container spacing={2} p={2}>
                    <FormControl>
                        <Grid item>
                            <FormLabel id="wo-type">
                                <Typography color="primary" variant="h6">
                                    <b>Create Sample Specs</b>
                                </Typography>
                            </FormLabel>
                        </Grid>

                        <Grid item>
                            <RadioGroup
                                aria-labelledby="wo-type-group-label"
                                value={WO}
                                onChange={handleRadioChange}
                                name="wo-type-group"
                            >
                                <FormControlLabel value="SMS" control={<Radio />} label="SMS (Salesman)" />
                                <FormControlLabel value="Fit" control={<Radio />} label="Fit" />
                                <FormControlLabel value="PP" control={<Radio />} label="PP (Pre-Production)" />
                                <FormControlLabel value="Ref" control={<Radio />} label="Reference" />
                                <FormControlLabel value="TOP" control={<Radio />} label="TOP (Top of Production)" />
                            </RadioGroup>
                        </Grid>
                        
                        <Grid item mt={3} display="flex" justifyContent="center">
                            <Button color="primary" variant="contained" onClick={handleClickNext}>
                                Next
                            </Button>
                        </Grid>
                    </FormControl>
                </Grid>
            </DialogContent>
        </Dialog>

        <Dialog
            open={ showDialog===0 }
            onClose={()=>{ setShowDialog(false) }}
        >
            <DialogContent>
                <Grid container spacing={2} p={2} direction="column">
                    <Grid item>
                        <Typography color="primary" variant="h6">
                            <b>Fit Number</b>
                        </Typography>
                    </Grid>
                
                    <Grid item>
                        <TextField 
                            defaultValue="1"
                            type="number"
                            onChange={handleChangeFit}
                            //make so that it only accepts integers
                        />
                    </Grid>

                    <Grid item mt={2} display="flex" justifyContent="center">
                        <Button color="primary" variant="outlined" sx={{m:1}} onClick={handleOpenDialog}>
                            Back
                        </Button>
                        <Button color="primary" variant="contained" sx={{m:1}} onClick={()=>{setShowDialog(false)}}>
                            Create
                        </Button>
                    </Grid>
                
                </Grid>
            </DialogContent>
        </Dialog>
    </>
    )
}

export default CreateSampleDialog;