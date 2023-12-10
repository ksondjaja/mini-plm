import React from "react";
import { NavLink } from "react-router-dom";
import { styled as styledMUI } from "@mui/system";
import {
    AppBar,
    Box,
    Button,
    Toolbar,
    Grid,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Fade,
    SvgIcon
} from '@mui/material';


function Nav(props) {
    const { state, logOut } = props;

    const MUIAppBar = styledMUI(AppBar)({
        padding: "1%"
    })

    return(
        // <Fade appear={false} easing={{ enter: "linear", exit: "linear" }}>
        //     <Box flexGrow="1">
                <MUIAppBar elevation={10} position="fixed" sx={{ zIndex: 999 }}>
                    <Toolbar>
                        <Grid container
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-start"
                        >
                            <Grid item xs={11}>
                                <Typography variant="h3">mini-plm</Typography>
                            </Grid>
                            {state.loggedIn &&
                                <Grid item xs={1}>
                                    <Button
                                        variant="contained"
                                        onClick={logOut}
                                    >
                                        Logout
                                    </Button>
                                </Grid>
                            }
                        </Grid>
                    </Toolbar>
                </MUIAppBar>
        //     </Box>
        // </Fade>
    )
}

export default Nav;