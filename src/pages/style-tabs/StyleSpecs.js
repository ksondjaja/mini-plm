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


export default function StyleSpecs ( props ){

  const { token, styleid, fetchSamples, fetchSpecs, samples, setSamples, sampleCount, setSampleCount, BACKEND_URL_STYLES } = props;

  const [postResponse, setPostResponse] = useState();
  const [postError, setPostError] = useState();
  const [postLoading, setPostLoading] = useState();

  const [loading, setLoading] = useState(true);
  const [specLoading, setSpecLoading] = useState(true);
  //const [error, setError] = useState()

  const controller = new AbortController();

  const [rowCount, setRowCount] = useState();
  
  const [columns, setColumns] = useState();


  const getColumns = async(specs) => {
    try{
      const rowCt = Object.keys(specs).length

      console.log('data: '+JSON.stringify(specs))
      console.log('row count: ' + rowCt);

      setRowCount(rowCt);

      // Get sample names, number of samples
      const sampleData = await fetchSamples({
        StyleId: styleid,
        Attributes: "StyleSamples"
      }, token)

      const spl = Array.from(Object.values(sampleData))
      const splCt = spl.length;

      console.log("spl: "+spl)
      console.log("splCt:"+splCt)

      setSamples(spl);
      setSampleCount(splCt)

      let allSpecs = [];
      let pomList = []

      if(spl){

        console.log(JSON.stringify("spl:"+JSON.stringify(spl)))

        // Set number of sample columns for DataGrid
        if(splCt>0){
          for (let s=0; s<splCt; s++){
            allSpecs.push([])
          }
        }
      
        // For each row of POM, POM info & initial specs
        for (const [key, value] of Object.entries(specs)){

          const p = {
            order: value.order, //row order number
            POMId: key,  //actual unique row Id
            code: value.code,
            pom: value.pom,
            init: value.init
          }
          
          pomList.push(p);

          console.log(JSON.stringify("value.samples: "+JSON.stringify(value.samples)))
            
          // For each row of POM, get measurements for each sample, put in corresponding column in allSpecs array

          for(let s=0; s<splCt; s++){
            const splId = spl[s].id

            console.log("splId:" + splId)

            const spec = value.samples[splId]

            allSpecs[s].push(spec)  
          }
        }

      }else{
        console.log("no samples data")
      }

    const table = [pomList, allSpecs]
    setColumns(table);

    console.log(table)

    }catch(err){
      console.log(err)
    }finally{
      setLoading(false); 
      setSpecLoading(false);
    }
  }

  const submitNewRow = async (row) => {
    try {
        const res = await axios.post(
            (BACKEND_URL_STYLES + '/addSpecRow'), 
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
        fetchSpecs({
          StyleId: styleid,
          Attributes: "StyleSpecs"
        }, token, true).then(response => getColumns(response))
    }
  }

  const submitUpdatedRow = async (row) => {
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

  const submitDeleteRow = async (row) => {
    try {
        const res = await axios.post(
            (BACKEND_URL_STYLES + '/deleteSpecRow'), 
            row,
            {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }
        );
        console.log(row);
        console.log('Delete Response: ' + JSON.stringify(res.data) );
        setPostResponse(JSON.stringify(res.data));
    } catch(err){
        console.log('Error: ' + JSON.stringify(err.message));
        setPostError(JSON.stringify(err.message));
    } finally {
        setPostLoading(false);
        
        fetchSpecs({
          StyleId: styleid,
          Attributes: "StyleSpecs"
        }, token, true).then(response => getColumns(response))
    }
  }

  const handleAddPOM = () => {

    // Each new POM row needs to have specs for each sample

    const sampleSpecs = {}
    const timeStamp = Date.now()

    console.log("samples:"+JSON.stringify(samples))
    console.log("sampleCount"+sampleCount)

    // Create new POM row for each sample
    for (let i=0; i<sampleCount; i++){

      const splId = samples[i].id;
      console.log("splId: "+ splId)

      const column = {
        order: rowCount+1, //row order number
        POMId: `POM${timeStamp}`,  //actual unique row Id
        SampleId: splId,
        Sample: samples[i].SampleName,
        bo: null,
        vdr: null,
        rev: null
      }

      sampleSpecs[splId] = column
    }

    // Submit new POM row

    const newRow = {
      order: rowCount+1, //row order number
      POMId: `POM${timeStamp}`,  //actual unique row Id
      code: '',
      pom: '',
      init: null,
      samples: sampleSpecs
    }

    const newData = {
      StyleId: styleid,
      NewRow: newRow
    }

    submitNewRow(newData)
    setRowCount(rowCount+1)
  }

  const saveUpdatedRow = (updatedRow) => {

    console.log(updatedRow);

    const updatedData = {
      StyleId: styleid,
      UpdatedRow: updatedRow
    }

    submitUpdatedRow(updatedData)
    return(updatedRow)
  }



  // **Bcs row reorder is not available in free version of MUI's React DataGrid component**
  // Create function to automatically sort rows based on order number upon row change
  // All row order num should be integers with 1 increment, no duplicate
  // Update order number for all columns, then update entire table in backend (re-submit entire StyleSpecs)
  // https://github.com/mui/mui-x/issues/2289


  // const handleChangeVisibility = (i) => {
  //   const visibility = showCol[i]
  //   console.log(visibility)
  //   let visibilities = showCol

  //   visibilities[i] = !visibility
  //   console.log(JSON.stringify(visibilities))

  //   setShowCol(visibilities)
  // }


  const handleDeleteClick = (id: GridRowId) => () => {

    const rowInfo = {
      StyleId: styleid,
      RowId: id
    }

    submitDeleteRow(rowInfo);
    setRowCount(rowCount-1);

    //assign new id for all rows
  };


  // Need to limit data types/value for each column
  // https://mui.com/x/react-data-grid/column-definition/#column-types
  // https://mui.com/x/react-data-grid/recipes-editing/#conditional-validation
  // How to limit row order num to integer
  // and measurements to fraction?

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
      field: 'order',
      headerName: 'No.',
      type: 'number',
      editable: true,
      align: 'left',
      headerAlign: 'left',
      minWidth: 20,
      columnMenuAlign: 'left'
    },
    {
      field: 'code',
      headerName: 'Code',
      editable: true,
      align: 'left',
      headerAlign: 'left',
      minWidth: 20,
      columnMenuAlign: 'left'
    },
    { 
      field: 'pom',
      headerName: 'Point of Measure',
      type: 'string',
      minWidth: 275,
      editable: true
    },
    {
      field: 'init',
      headerName: 'Initial Specs',
      type: 'number',
      editable: true,
      minWidth: 20,
      disableColumnMenu: true
    }
  ];

  const sampleColumns: GridColDef[] = [
    {
      field: 'SampleId'
    },
    {
      field: 'Sample'
    },
    {
      field: 'order',
      type: 'number'
    },
    {
      field: 'vdr',
      headerName: 'Vendor Msmt',
      type: 'number',
      editable: true,
      minWidth: 20,
      disableColumnMenu: true
    },
    {
      field: 'bo',
      headerName: 'Buyer Msmt',
      type: 'number',
      editable: true,
      minWidth: 20,
      disableColumnMenu: true
    },
    {
      field: 'rev',
      headerName: 'Revised Specs',
      type: 'number',
      editable: true,
      minWidth: 20,
      disableColumnMenu: true
    },
  ]

  useEffect(()=>{
    fetchSamples({
      StyleId: styleid,
      Attributes: "StyleSamples"
    }, token).then(response => Array.from(Object.values(response)))
    .then(fetchSpecs({
        StyleId: styleid,
        Attributes: "StyleSpecs"
      }, token, true)
      .then(response => getColumns(response)))
      .then(console.log("columns: "+columns))
      return() => {controller.abort()};
  }, [token]);

  return(
      <>
        {!specLoading && !loading && (columns.length>0) &&
          <>
          <Box display="inline-flex">
            <Box key={1} display="flex" flexDirection="column" mr={1}>
              <Typography variant="body1" color="black" sx={{ fontWeight: "bold" }}>
                &nbsp;
              </Typography>
              
              <DataGrid rows={columns[0]} columns={initColumns}
                getRowId={(row) => row.POMId}
                initialState={{
                  columns: {
                    columnVisibilityModel: {
                      order: false
                    },
                  },
                }}
                processRowUpdate={(updatedRow, originalRow)=>{
                  return saveUpdatedRow(updatedRow)
                }}
                //onProcessRowUpdateError={handleProcessRowUpdateError}
                autoHeight={true}
                sx={{'.MuiDataGrid-cell': { borderRight: '1px solid #d0d0d0', fontSize: '13px' },
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
                  maxHeight: "168px !important",
                  fontSize: '13px',
                }}}
              />
            </Box>

            {samples.length>0 &&
              columns[1].map((s, i)=>(
                <Box key={i+1} display="flex" flexDirection="column" mr={1}>
                  <Box display="flex" justifyContent="center">
                    <Typography variant="body1" color="black" sx={{ fontWeight: "bold" }}>
                      {samples[i].SampleName}
                    </Typography>
                  </Box>
                  
                  <DataGrid rows={s} columns={sampleColumns}
                    getRowId={(row) => row.POMId}
                    initialState={{
                      columns: {
                        columnVisibilityModel: {
                          SampleId: false,
                          Sample: false,
                          order: false
                        },
                      },
                    }}
                    processRowUpdate={(updatedRow, originalRow)=>{
                      return saveUpdatedRow(updatedRow)
                    }}
                    //onProcessRowUpdateError={handleProcessRowUpdateError}
                    autoHeight={true}
                    sx={{ '.MuiDataGrid-cell': { borderRight: '1px solid #d0d0d0', fontSize: '13px' },
                    '.MuiDataGrid-footerContainer': { display: 'none' },
                    "& .MuiDataGrid-columnHeaderTitle": {
                      whiteSpace: "normal",
                      lineHeight: "normal"
                    },
                    "& .MuiDataGrid-columnHeader": {
                      height: "unset !important"
                    },
                    "& .MuiDataGrid-columnHeaders": {
                      maxHeight: "168px !important",
                      fontSize: '13px',
                    }}}
                  />
                </Box>
              ))
            }
          </Box>
          <Box item xs={12} mt={1}>
              <Button color="primary" variant="contained" onClick={handleAddPOM}>
                Add POM
              </Button>
          </Box>
          </>
        }
      </>
  )
}