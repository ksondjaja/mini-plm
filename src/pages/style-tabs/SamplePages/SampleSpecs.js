// MUI DATA GRID DOCUMENTATION: https://mui.com/x/react-data-grid/editing/

import { useState, useEffect } from 'react';
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
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { 
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowId,
  GridRowsProp
} from '@mui/x-data-grid';


export default function SampleSpecs ( props ){

  const { token, styleid, fetchSamples, fetchSpecs, BACKEND_URL_STYLES } = props;

  const [postResponse, setPostResponse] = useState();
  const [postError, setPostError] = useState();
  const [postLoading, setPostLoading] = useState();

  const [loading, setLoading] = useState(true);
  //const [error, setError] = useState()

  const controller = new AbortController();

  const [currentSample, setCurrentSample] = useState();
  const [tableData, setTableData] = useState();
  const [rowCount, setRowCount] = useState()
  

  const Style = {
    StyleId: styleid,
    Attributes: "StyleSamples"
}

  

  const submitRowUpdate = async (row) => {
    try {
        const res = await axios.post(
            (BACKEND_URL_STYLES + '/updateSpecRow'), 
            row,
            {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }
        );
        console.log(row);
        console.log('Response: ' + JSON.stringify(res.data) );
        setPostResponse(JSON.stringify(res.data));

    } catch(err){
        console.log('Error: ' + JSON.stringify(err.message));
        setPostError(JSON.stringify(err.message));
    } finally {
        setPostLoading(false);
        //fetchSpecs(Style, token);
    }
  }


  const saveUpdatedRow = (updatedRow) => {

    console.log(updatedRow);

    const updatedData = {
      StyleId: styleid,
      SampleNumber: currentSample,
      UpdatedRow: updatedRow
    }

    submitRowUpdate(updatedData)
    return(updatedRow)
  }


  const handleDeleteClick = (id: GridRowId) => () => {
    setTableData(tableData.filter((row) => row.id !== id));
    setRowCount(rowCount-1)
  };

  
  const handleAddPOM = () => {

    const newPOM = {
      id: parseInt(rowCount+1),
      code: '',
      pom: '',
    }

    const sampleSpec = {
      bo: null,
      vdr: null,
      rev: null
    }

    const updatedData = {
      StyleId: styleid,
      SampleNumber: currentSample,
      UpdatedRow: newPOM
    }

    submitRowUpdate(updatedData)

    setRowCount(rowCount+1)

  }

  const initColumns: GridColDef[] = [
    {
      field: 'delete',
      type: 'actions',
      headerName: '',
      align: 'left',
      width: 20,
      disableColumnMenu: true,
      renderCell: ({ id }) => {
        return(
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />
        )
      }
    },
    {
      field: 'code',
      headerName: 'Code',
      editable: true,
      align: 'left',
      headerAlign: 'left',
      width: 120,
      columnMenuAlign: 'left'
    },
    { 
      field: 'pom',
      headerName: 'Point of Measure',
      width: 280,
      editable: true
    },
    {
      field: 'init',
      headerName: 'Initial Specs',
      editable: true,
      width: 100,
      disableColumnMenu: true
    }
  ];

  const sampleColumns: GridColDef[] = [
    {
      field: 'vdr',
      headerName: 'Vendor Msmt',
      editable: true,
      width: 100,
      disableColumnMenu: true
    },
    {
      field: 'bo',
      headerName: 'Buyer Msmt',
      editable: true,
      width: 100,
      disableColumnMenu: true
    },
    {
      field: 'rev',
      headerName: 'Revised Specs',
      editable: true,
      width: 100,
      disableColumnMenu: true
    },
  ]

  useEffect(()=>{
      fetchSpecs(Style, token);
      console.log('tableData: ' + tableData);
      return() => controller.abort();
  }, [token]);

  return(
    
      <Grid container spacing={1}>

        {!loading &&
          <>
          <Grid item xs={6}>
              <DataGrid rows={tableData} columns={initColumns}
                processRowUpdate={(updatedRow, originalRow)=>{
                  return saveUpdatedRow(updatedRow)
                }}
                //onProcessRowUpdateError={handleProcessRowUpdateError}
                autoHeight={true}
                sx={{'.MuiDataGrid-cell': { borderRight: '1px solid #d0d0d0' },
                '.MuiDataGrid-footerContainer': { display: 'none' },
                "& .MuiDataGrid-columnHeaderTitle": {
                  whiteSpace: "normal",
                  lineHeight: "normal"
                },
                "& .MuiDataGrid-columnHeader": {
                  // Forced to use important since overriding inline styles
                  height: "unset !important"
                },
                "& .MuiDataGrid-columnHeaders": {
                  // Forced to use important since overriding inline styles
                  maxHeight: "168px !important"}}}
              />
          </Grid>
          <Grid item xs={6}>
            <DataGrid rows={tableData} columns={sampleColumns}
                processRowUpdate={(updatedRow, originalRow)=>{
                  return saveUpdatedRow(updatedRow)
                }}
                //onProcessRowUpdateError={handleProcessRowUpdateError}
                autoHeight={true}
                sx={{'.MuiDataGrid-cell': { borderRight: '1px solid #d0d0d0' },
                '.MuiDataGrid-footerContainer': { display: 'none' },
                "& .MuiDataGrid-columnHeaderTitle": {
                  whiteSpace: "normal",
                  lineHeight: "normal"
                },
                "& .MuiDataGrid-columnHeader": {
                  height: "unset !important"
                },
                "& .MuiDataGrid-columnHeaders": {
                  maxHeight: "168px !important"}}}
              />
          </Grid>
          <Grid item xs={12} mt={1}>
            <Button color="primary" variant="contained" onClick={handleAddPOM}>
              Add POM
            </Button>
          </Grid>
          </>
        }
      </Grid>
  )
}