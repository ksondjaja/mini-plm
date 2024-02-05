import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {
    Grid,
    IconButton,
    Link,
    TextField,
    Box,
    Typography,
    Button
} from '@mui/material';

function StyleList(props) {

    const { token, setCurrentStyle } = props;

    const BACKEND_URL_STYLES = process.env.REACT_APP_BACKEND_URL_STYLES;

    const navigate = useNavigate()

    const fetchStyle = async (styleid) => {

        const StyleId= JSON.stringify(styleid);

        console.log(StyleId);

        try{
            const res = await axios.get(
                (BACKEND_URL_STYLES + `/${StyleId}`),
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                }
            )
            console.log('Response: ' + JSON.stringify(res.data));
            setCurrentStyle(res.data);

            navigate('/stylepage');
        }catch(err){
            console.log('Error: ' + JSON.stringify(err.message));
        }
    }

    const handleClickStyle = styleid =>{
        fetchStyle(styleid);
    }

    return (
        <Grid container spacing={3} mb={5} textAlign="center">
            {props.loading && <p>Loading...</p>}
            {!props.loading && props.error && <p>{props.error}</p>}
            {!props.loading && !props.error && !props.response && <p>No Styles in Database</p>}
            {!props.loading && !props.error && props.response && !props.token && <p>Missing Token</p>}

            {!props.loading && !props.error && props.response && props.token && (props.response === undefined) &&
                <p>Data object type error</p>
            }

            {!props.loading && !props.error && props.response && props.token && (props.response !== undefined) &&
                <Grid item xs={3} justifyContent="center" textAlign="center">
                    {props.response["Count"]===0 && <p>No Styles in Database</p>}
                </Grid>
            }

            {!props.loading && !props.error && props.response && props.token && (props.response !== undefined) &&
                <>
                    <Grid item xs={12} justifyContent="center" textAlign="center">
                        <Typography>
                            {JSON.stringify(props.response["Count"])} Styles found in Database
                        </Typography>
                    </Grid>

                    {props.response["Items"].map(s => (
                        <Grid item key={s.StyleId} xs={4} textAlign="left">
                            <Button component="box"
                                sx={{ display: "flex", flexDirection: "column", margin: 2, border:2, padding: 2}}
                                onClick={()=> {handleClickStyle(s.StyleId)}}
                            >
                                <Typography variant="h5">
                                    {s.StyleName}
                                </Typography>

                                <Typography variant="body1">
                                    <b>Season:</b> {s.Season} {s.DeliveryDate? JSON.stringify(s.DeliveryDate).slice(1,5) : ''}
                                </Typography>

                                <Typography variant="body1">
                                    <b>Category:</b> {s.Category}
                                </Typography>

                            </Button>
                        </Grid>
                    ))}   
                </>
            }
        </Grid>
    )
}

export default StyleList;