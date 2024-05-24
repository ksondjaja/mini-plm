import {
    Grid,
    Link,
    Typography
} from '@mui/material';


function SampleMenu( props ){

  const { sampleTab, setSampleTab } = props;

  const tabs = ['History', 'Specs', 'Grading']

    return(
        <Grid container>
          <Grid item xs={12} display="flex" flexDirection="row" mb={3}>
            {tabs.map((t, i)=>(
              <Link key={i} mr={2} onClick={()=>{setSampleTab(t)}}
              sx={{
                textDecoration: "none",
                fontWeight: ((t===sampleTab)? "bold" : "normal"),
                '&:hover': { textDecoration: "underline", cursor: "pointer" }
              }}
            >
              <Typography>
                {t}
              </Typography>
            </Link>

            ))}
          </Grid>

          

        </Grid>
    )
}

export default SampleMenu;