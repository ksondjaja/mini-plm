import { styled as styledMUI } from "@mui/system";
import {
    AppBar,
    Box,
    Button,
    Toolbar,
    Grid,
    IconButton,
    Typography,
    Link,
    Menu,
    MenuItem,
    Fade,
    SvgIcon
} from '@mui/material';


function StyleMenu(props) {

    const MUIAppBar = styledMUI(AppBar)({
        padding: "1%"
    })

    const styleUrl = "/stylepage/" + props.styleid

    const styleLinks = [
        {id: 1, name: "Overview", tab:"Overview"},
        {id: 2, name: "Images", tab: "Images"},
        {id: 3, name: "Samples", tab: "Samples"},
        {id: 4, name: "Grading", tab: "Grading"},
        {id: 5, name: "BOM", tab: "BOM"},
        {id: 6, name: "Construction", tab: "Construction"},
        {id: 7, name: "Costs", url: "Costs"},
    ]

    return(
        <MUIAppBar
            elevation={0}
            position="fixed"
            color="transparent"
            sx={{ zIndex: 999, mt: 12 }}
        >
            <Toolbar sx={{ display: "flex", flexDirection: "column" }}>
                <Box item sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", width: "100%", mb: 1}}>
                    {styleLinks.map(l => (
                        <Link
                            key={l.id}
                            href= {l.url}
                            variant="body1"
                            color="primary"
                            underline="none"
                            sx={{ mx: 2,
                                fontWeight: ((l.tab===props.tab)? "bold" : "normal"),
                                '&:hover': { textDecoration: "underline", cursor: "pointer" }
                            }}
                            onClick={()=>props.setTab(l.tab)}
                        >
                            {l.name}
                        </Link>
                    ))}
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", width: "100%"}}>
                    <Typography variant="body1" color="black">
                        [{props.styleid}] {props.stylename} &gt; Overview
                    </Typography>
                </Box>
            </Toolbar>
        </MUIAppBar>
    )
}

export default StyleMenu;