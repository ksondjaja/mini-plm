import React from "react";
import { Container, Box } from '@mui/material';

export const Layout = ({children}) => (
    <>
        <Box sx={{height: 65, backgroundColor: '#FFFFFF'}}/>
        <Container maxWidth="lg"
            //sx={{ mt:15 }}
        >
            {children}
        </Container>
    </>
)

export const StylePageLayout = ({children}) => (
    <>
        <Box sx={{height: 25, backgroundColor: '#FFFFFF'}}/>
        <Container maxWidth="lg"
            sx={{ mt: 20 }}
        >
            {children}
        </Container>
    </>
)