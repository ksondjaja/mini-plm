import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import dayjs from 'dayjs';
import {
    Grid,
    TextField,
    Select,
    MenuItem,
    Box,
    Typography,
    Button
} from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';


export default function SamplesSpec( props ){

    return(
        <Grid container>
            <Grid item>
                <DataGrid rows={initRows} columns={initColumns} />
            </Grid>

        </Grid>
    )
}

const initColumns: GridColDef[] = [
    {
        field: 'code',
        headerName: 'Code',
        editable: true,
        align: 'left',
        headerAlign: 'left',
    },
    { 
      field: 'POM',
      headerName: 'Point of Measure',
      width: 180,
      editable: true
    },
    {
      field: 'init',
      headerName: 'Initial Specs',
      editable: true,
    },
  ];

  const sampleColumns: GridColDef[] = [
    {
      field: 'vdr',
      headerName: 'Vendor Msmt',
      editable: false,
    },
    {
      field: 'bo',
      headerName: 'BO Msmt',
      editable: true,
    },
    {
      field: 'diff',
      headerName: 'BO Diff. from Spec',
      editable: false,
    },
    {
      field: 'rev',
      headerName: 'Revised Spec',
      editable: false,
    },
  ]

  const initRows: GridRowsProp = [
    {
      id: 1,
      code: 'T101',
      pom: 'Front Length',
      init: 24.5
    },
  ];