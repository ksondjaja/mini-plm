import {
    Grid,
    Link,
    Typography
} from '@mui/material';


function SampleMenu( props ){

  const { sampleTab, setSampleTab } = props;

    return(
        <Grid container>
          <Grid item xs={12} display="flex" flexDirection="row" mb={3}>
            <Link mr={2} onClick={()=>{setSampleTab('history')}}
              sx={{
                textDecoration: ((sampleTab==='history')? "underline" : "none"),
                '&:hover': { textDecoration: "underline", cursor: "pointer" }
              }}
            >
              <Typography>
                History
              </Typography>
            </Link>

            <Link mr={2} onClick={()=>{setSampleTab('specs')}}
              sx={{
                textDecoration: ((sampleTab==='specs')? "underline" : "none"),
                '&:hover': { textDecoration: "underline", cursor: "pointer" }
              }}
            >
              <Typography>
                Specs
              </Typography>
            </Link>


            <Link ml={2} onClick={()=>{setSampleTab('grading')}}
              sx={{
                textDecoration: ((sampleTab==='grading')? "underline" : "none"),
                '&:hover': { textDecoration: "underline", cursor: "pointer" }
              }}
            >
              <Typography>
                Grading
              </Typography>
            </Link>
          </Grid>

          

        </Grid>
    )
}

export default SampleMenu;