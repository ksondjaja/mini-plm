// MUI DATA GRID DOCUMENTATION: https://mui.com/x/react-data-grid/editing/

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
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { 
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowId,
  GridRowsProp
} from '@mui/x-data-grid';


export default function SampleSpecs ( props ){

  // Show more columns based on Samples created

  const [tableData, setTableData] = useState([
    // {
    //   id: 1,
    //   code: 'T101',
    //   pom: 'Front Body Length - from HPS Seam',
    //   init: 24.5
    // },
    // {
    //   id: 2,
    //   code: 'T102',
    //   pom: 'Back Body Length - from HPS Seam',
    //   init: 24
    // },
    // {
    //   id: 3,
    //   code: 'T103',
    //   pom: 'Shoulder Width - seam to seam',
    //   init: 15
    // }
  ])

  const [rowCount, setRowCount] = useState(tableData.length)
  //const [error, setError] = useState()


  const saveUpdatedRow = (updatedRow) => {

    const rowId = parseInt(updatedRow.id);

    //console.log(rowId);

    let newTable = tableData;

    newTable[rowId-1] = updatedRow;

    setTableData(newTable);

    return(updatedRow)
  }

  // const handleProcessRowUpdateError = error => {
  //   setError(error.message)
  // }

  const handleDeleteClick = (id: GridRowId) => () => {
    setTableData(tableData.filter((row) => row.id !== id));
  };
  
  const handleAddPOM = () => {

    const newPOM = {
      id: parseInt(rowCount+1),
      code: '',
      pom: '',
      init: 0
    }

    setTableData(
      tableData => [...tableData, newPOM]
    )

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

    return(
        <Grid container spacing={1}>
            <Grid item xs={6.1}>
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

        </Grid>
    )
}



  // const initRows: GridRowsProp = [
  //   {
  //     id: 1,
  //     code: 'T101',
  //     pom: 'Front Body Length - from HPS Seam',
  //     init: 24.5
  //   },
  //   {
  //     id: 2,
  //     code: 'T102',
  //     pom: 'Back Body Length - from HPS Seam',
  //     init: 24
  //   },
  //   {
  //     id: 3,
  //     code: 'T103',
  //     pom: 'Shoulder Width - seam to seam',
  //     init: 15
  //   },
  // ];