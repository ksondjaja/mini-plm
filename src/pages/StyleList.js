import {
    Grid,
    TextField,
    Box,
    Typography,
    Button
} from '@mui/material';

function StyleList(props) {

    return (
        <Grid container spacing={3} textAlign="center">
            {props.loading && <p>Loading...</p>}
            {!props.loading && props.error && <p>{props.error}</p>}
            {!props.loading && !props.error && !props.response && <p>No Styles in Database</p>}
            {!props.loading && !props.error && props.response && !props.token && <p>Missing Token</p>}
            {!props.loading && !props.error && props.response && props.token &&

                //<p>{props.style}</p>

                props.response["Styles"].map(s => (
                <Grid item key={s.StykeId} xs={4} textAlign="left">
                    <Box border={2} padding={2}>
                        <Typography variant="h5">
                            {s.StyleName}
                        </Typography>
                        <Typography variant="body1">
                            <b>Season:</b> {s.Season}
                        </Typography>
                        <Typography variant="body1">
                            <b>Category:</b> {s.Category}
                        </Typography>
                    </Box>
                </Grid>
                ))

                //<></>
            
                
            }
            

        </Grid>
    )
}

export default StyleList;