import React from "react";
import { Container } from '@mui/material';

export const Layout = ({children}) => (
    <>
        <Container maxWidth="md" sx={{ marginTop: '120px' }}>
            {children}
        </Container>
    </>
)