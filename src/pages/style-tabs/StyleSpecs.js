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

  const { token, styleid, fetchSamples, fetchSpecs, BACKEND_URL_STYLES } = props;

  const [postResponse, setPostResponse] = useState();
  const [postError, setPostError] = useState();
  const [postLoading, setPostLoading] = useState();

  const [loading, setLoading] = useState(true);
  const [specLoading, setSpecLoading] = useState(true);
  //const [error, setError] = useState()

  const controller = new AbortController();

  const [samples, setSamples] = useState([]);
  const [sampleCount, setSampleCount] = useState();

  const [rowCount, setRowCount] = useState();
  
  const [columns, setColumns] = useState();
  

  const Style = {
    StyleId: styleid,
    Attributes: "StyleSpecs"
  }

  const getColumns = async(data) => {

    const rowCt = parseInt(data.length)

    console.log('data: '+JSON.stringify(data[0]))
    console.log('row count: ' + rowCt);

    setRowCount(rowCt);

    // Get sample names, number of samples
    const samplesData = await fetchSamples({
                          StyleId: styleid,
                          Attributes: "StyleSamples"
                        }, token, false)
    
    const spl = samplesData[0]
    const splCt = samplesData[1]

    setSamples(spl);
    setSampleCount(splCt);

    try{
      let allSpecs = [];
      let pomList = []

      // Set number of sample columns for DataGrid
      if(splCt>0){
        for (let s=0; s<splCt; s++){
          allSpecs.push([])
        }
      
    
        // For each row of POM, POM info & initial specs
        for (const [key, value] of data){
          
          const p = {
            id: value.id,
            POMId: key,
            code: value.code,
            pom: value.pom,
            init: value.init
          }
          
          pomList.append(p);
            
          // For each row of POM, get measurements for each sample, put in corresponding column in allSpecs array
          let s = 0
          for (const [k,v] of value.sample){
            allSpecs[s].push(v)
            s++;
          }
        }
      }else{
        console.log("no data")
      }

      const table = [pomList, allSpecs]
      setColumns(table);

    }catch(err){
      console.log(err)
    }finally{
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
        fetchSpecs(Style, token, true).then(response => getColumns(response))
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
        console.log('Response: ' + JSON.stringify(res.data) );
        setPostResponse(JSON.stringify(res.data));
    } catch(err){
        console.log('Error: ' + JSON.stringify(err.message));
        setPostError(JSON.stringify(err.message));
    } finally {
        setPostLoading(false);
        fetchSpecs(Style, token, true).then(response => getColumns(response))
    }
  }

  const handleAddPOM = () => {

    // Each new POM row needs to have a row for each sample

    const sampleSpecs = {}
    const timeStamp = Date.now()

    // Create new POM row for each sample
    for (const [splKey, value] in samples){

      const column = {
        order: rowCount+1, //row order number
        POMId: `POM${timeStamp}`,  //actual unique row Id
        SampleId: value.id,
        Sample: splKey,
        bo: null,
        vdr: null,
        rev: null
      }

      sampleSpecs.splKey = column
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


  // const handleChangeVisibility = (i) => {
  //   const visibility = showCol[i]
  //   console.log(visibility)
  //   let visibilities = showCol

  //   visibilities[i] = !visibility
  //   console.log(JSON.stringify(visibilities))

  //   setShowCol(visibilities)
  // }


  const handleDeleteClick = (params: GridRowProps) => () => {

    const rowInfo = {
      StyleId: styleid,
      RowId: params.POMId
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
      renderCell: ({ params }) => {
        return(
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(params)}
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
      fetchSpecs(Style, token, true)
      .then(response => getColumns(response))
      return() => {controller.abort()};
  }, [token]);

  return(
      <>
        {!specLoading &&
          <>
          <Box display="inline-flex">
            <Box key={1} display="flex" flexDirection="column" mr={1}>
              <Typography variant="body1" color="black" sx={{ fontWeight: "bold" }}>
                &nbsp;
              </Typography>
              
              <DataGrid rows={columns[0]} columns={initColumns}
                getRowId={(row) => row.POMId}
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

            {/* Map the column below --> for each sample, create a new column 
            Fix Key so that each column & row is unique*/}

            {sampleCount>0 &&
              columns[1].map((s, i)=>(
                <Box key={i+1} display="flex" flexDirection="column" mr={1}>
                  <Box display="flex" justifyContent="center">
                    <Typography variant="body1" color="black" sx={{ fontWeight: "bold" }}>
                      {s[0].Sample}
                    </Typography>
                  </Box>
                  
                  <DataGrid rows={s} columns={sampleColumns}
                    getRowId={(row) => row.POMId}
                    initialState={{
                      columns: {
                        columnVisibilityModel: {
                          // Hide columns status and traderName, the other columns will remain visible
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