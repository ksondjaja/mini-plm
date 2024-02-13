import React from "react";
import { Container } from '@mui/material';

export const Layout = ({children}) => (
    <>
        <Container maxWidth="lg" sx={{ mt:15 }}>
            {children}
        </Container>
    </>
)

export const StylePageLayout = ({children}) => (
    <>
        <Container maxWidth="lg" sx={{ mt: 25 }}>
            {children}
        </Container>
    </>
)