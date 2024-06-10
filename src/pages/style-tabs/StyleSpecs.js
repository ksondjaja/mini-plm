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
  const [currentSample, setCurrentSample] = useState();

  const [rowCount, setRowCount] = useState();
  
  let tableData = [];
  
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

    const samplesData = await fetchSamples({
                          StyleId: styleid,
                          Attributes: "StyleSamples"
                        }, token, false)

    const spl = samplesData[0]
    const splCt = samplesData[1]

    console.log(spl, splCt)

    setSamples(spl);
    setSampleCount(splCt);

    try{
      let pomList = [];
      let allSpecs = [];

      if(splCt>0){
        for (let s=0; s<splCt; s++){
          allSpecs.push([])
        }
      }

      if(rowCt>0){
  
        for (let i=0; i<rowCt; i++){
    
          const p = {
            id: data[i].id,
            code: data[i].code,
            pom: data[i].pom,
            init: data[i].init
          }
          console.log('p:'+p);
    
          pomList.push(p);

          
    
          for (let s=0; s<splCt; s++){
            const sampleSpec = data[i].samples[s]
            allSpecs[s].push(sampleSpec)
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

  const handleAddPOM = () => {

    const sampleSpecs = []

    for(let s=0; s<sampleCount; s++){
      const column = {
        SampleId: s+1,
        Sample: samples[s].SampleType,
        id: rowCount+1,
        bo: null,
        vdr: null,
        rev: null
      }
      sampleSpecs.push(column)
    }

    const newRow = {
      id: rowCount+1,
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

  // const handleChangeVisibility = (i) => {
  //   const visibility = showCol[i]
  //   console.log(visibility)
  //   let visibilities = showCol

  //   visibilities[i] = !visibility
  //   console.log(JSON.stringify(visibilities))

  //   setShowCol(visibilities)
  // }


  const handleDeleteClick = (id: GridRowId) => () => {
    //setTableData(tableData.filter((row) => row.id !== id));
    //setRowCount(rowCount-1)
  };


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
      minWidth: 20,
      columnMenuAlign: 'left'
    },
    { 
      field: 'pom',
      headerName: 'Point of Measure',
      minWidth: 275,
      editable: true
    },
    {
      field: 'init',
      headerName: 'Initial Specs',
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
      field: 'vdr',
      headerName: 'Vendor Msmt',
      editable: true,
      minWidth: 20,
      disableColumnMenu: true
    },
    {
      field: 'bo',
      headerName: 'Buyer Msmt',
      editable: true,
      minWidth: 20,
      disableColumnMenu: true
    },
    {
      field: 'rev',
      headerName: 'Revised Specs',
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
                    initialState={{
                      columns: {
                        columnVisibilityModel: {
                          // Hide columns status and traderName, the other columns will remain visible
                          SampleId: false,
                          Sample: false,
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