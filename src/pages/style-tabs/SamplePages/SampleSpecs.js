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

  const { token, styleid, fetchSamples, BACKEND_URL_STYLES } = props;

  const [postResponse, setPostResponse] = useState();
  const [postError, setPostError] = useState();
  const [postLoading, setPostLoading] = useState();

  const [loading, setLoading] = useState(true);
    const controller = new AbortController();

  const [sampleNumber, setSampleNumber] = useState(0);
  const [measType, setMeasType] = useState('init');

  const [tableData, setTableData] = useState();

  const [rowCount, setRowCount] = useState()
  //const [error, setError] = useState()

  const Style = {
    StyleId: styleid,
    Attributes: "StyleSamples"
}

  const fetchSpecs = async (style, token) =>{
    try{
      const res = await axios.get(
          (BACKEND_URL_STYLES + `/${style.StyleId}`),
          {
              headers: {
                  Authorization: 'Bearer ' + token
              },
              params: {
                  attributes: style
              }
          }
      )
      console.log('Response: ' + JSON.stringify(res.data));

      const specs = (res.data)["Item"]["StyleSamples"][0]["SampleSpecs"]

      setTableData(specs);
      setRowCount(specs.length);
  }catch(err){
      console.log('Error: ' + JSON.stringify(err.message));
  }finally{
      setLoading(false);
  }
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
      SampleNumber: sampleNumber,
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
      init: 0,
      vdr: 0,
      bo: 0,
      rev: 0,
    }

    const updatedData = {
      StyleId: styleid,
      MeasType: measType,
      SampleNumber: sampleNumber,
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
    },
    {
      field: 'vdr',
      headerName: 'Vendor Msmt',
      editable: true,
      width: 100,
      disableColumnMenu: true
    },
    {
      field: 'bo',
      headerName: 'BO Msmt',
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
  ];

  // const sampleColumns: GridColDef[] = [
  //   {
  //     field: 'vdr',
  //     headerName: 'Vendor Msmt',
  //     editable: false,
  //   },
  //   {
  //     field: 'bo',
  //     headerName: 'BO Msmt',
  //     editable: true,
  //   },
  //   {
  //     field: 'diff',
  //     headerName: 'BO Diff. from Spec',
  //     editable: false,
  //   },
  //   {
  //     field: 'rev',
  //     headerName: 'Revised Spec',
  //     editable: false,
  //   },
  // ]

  useEffect(()=>{
      fetchSpecs(Style, token);
      console.log('tableData: ' + tableData);
      return() => controller.abort();
  }, [token]);

  return(
    
      <Grid container spacing={1}>

        {!loading &&

          <>
          {/* <p>{tableData.init}</p><br/>
          <p>{tableData}</p><br/>
          <p>{rowCount}</p> */}
          <Grid item xs={12}>
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