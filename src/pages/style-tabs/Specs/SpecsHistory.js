// Tutorial on loading from database into Data Grid:
// https://www.freecodecamp.org/news/how-to-integrate-material-ui-data-grid-in-react-using-data-from-a-rest-api/
// Save row edit:
// https://stackoverflow.com/questions/69843397/how-to-get-values-of-row-after-edit-for-mui-data-grid

// Need to debug why updated row id is undefined

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


export default function SpecsHistory ( props ){

  const [tableData, setTableData] = useState([])
  const [rowCount, setRowCount] = useState(tableData.length)
  const [error, setError] = useState()


  const handleProcessRowUpdate = (updatedRow, originalRow) => {
    console.log(tableData)

    console.log(updatedRow);

    const updatedId = parseInt(updatedRow["id"]);

    console.log(updatedId);

    let newTable = [tableData.items];

    newTable[updatedId-1] = updatedRow;
    setTableData(newTable);

    console.log(tableData)
  }

  const handleProcessRowUpdateError = error => {
    setError(error.message)
  }
  
  const handleAddPOM = () => {

    const newPOM = {
      id: rowCount+1,
      code: '',
      pom: '',
      init: 0
    }

    setTableData(
      tableData => [...tableData, newPOM]
    )

    setRowCount(rowCount+1)
  }

    return(
        <Grid container spacing={2}>
            <Grid item xs={12}>
              {error}
            </Grid>
            <Grid item xs={6}>
                <DataGrid rows={tableData} columns={initColumns}
                  processRowUpdate={handleProcessRowUpdate}
                  onProcessRowUpdateError={handleProcessRowUpdateError}
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
            <Grid item xs={12}>
              <Button color="primary" variant="contained" onClick={handleAddPOM}>
                Add POM
              </Button>
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
        width: 120,
        columnMenuAlign: 'left'
    },
    { 
      field: 'pom',
      headerName: 'Point of Measure',
      width: 300,
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