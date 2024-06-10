import { Link, useLocation, useMatch } from "react-router-dom";
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


export const StyleMenu = (props) => {

    const location = useLocation();

    const MUIAppBar = styledMUI(AppBar)({
        padding: props.mode==="stylePage" ? "1%": "none"
    })

    return(
        <MUIAppBar
            elevation={0}
            color="transparent"
            position={props.mode==="stylePage" ? "fixed": "static"}
            sx={{ zIndex: 999, mt: (props.mode==="stylePage")? 12 : 0 }}
        >
            <Toolbar sx={{ display: "flex", flexDirection: "column" }}>
                <Box item sx={{ display: "flex", alignItems: "center", justifyContent: props.alignment, width: "100%", mb: 1}}>
                    {(props.styleLinks).map((l) => (
                        <Link
                            key={l.id}
                            to = {"."+l.url}
                            style = {{ textDecoration: "none" }}
                            onClick = {()=>props.setTab(l.name)}
                        >
                            <Typography
                                variant="body1"
                                color="primary"
                                underline="none"
                                sx={{  mr: 4,
                                    fontWeight: ((l.name===props.tab)? "bold" : "normal"),
                                    '&:hover': { textDecoration: "underline", cursor: "pointer" }
                                }}
                            >
                                {l.name}
                            </Typography>
                        </Link>
                    ))}
                </Box>
                {props.mode==='stylePage'&&
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", width: "100%"}}>
                        <Typography variant="body1" color="black">
                            [{props.styleid}] {props.stylename} &gt; {props.tab}
                        </Typography>
                    </Box>
                }
            </Toolbar>
        </MUIAppBar>
    )
}