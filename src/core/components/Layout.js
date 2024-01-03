import React from "react";
import { Container } from '@mui/material';

export const Layout = ({children}) => (
    <>
        <Container maxWidth="lg" sx={{ marginTop: '120px' }}>
            {children}
        </Container>
    </>
)