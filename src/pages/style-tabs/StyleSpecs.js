import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import dayjs from 'dayjs';
import SpecsHistory from "./Specs/SpecsHistory";
import {
    Grid,
    Link,
    Typography
} from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';


function StyleSpecs( props ){

  const [specTab, setSpecTab] = useState('history')


    return(
        <Grid container>
          <Grid item xs={12} display="flex" flexDirection="row" mb={3}>
            <Link mr={2} onClick={()=>{setSpecTab('history')}}
              sx={{
                textDecoration: ((specTab==='history')? "underline" : "none"),
                '&:hover': { textDecoration: "underline", cursor: "pointer" }
              }}
            >
              <Typography>
                History
              </Typography>
            </Link>
            <Link ml={2} onClick={()=>{setSpecTab('grading')}}
              sx={{
                textDecoration: ((specTab==='grading')? "underline" : "none"),
                '&:hover': { textDecoration: "underline", cursor: "pointer" }
              }}
            >
              <Typography>
                Grading
              </Typography>
            </Link>
          </Grid>

          <Grid item xs={12}>
            { specTab==='history' &&
              <SpecsHistory/>
            }
          </Grid>

        </Grid>
    )
}

export default StyleSpecs;