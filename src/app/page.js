"use client"

import NoSSRWrapper from "./components/NoSSRWrapper";
import App from './components/App';
import React from 'react';
import { Typography } from '@mui/material';

export default function Home() {
  return (
    <NoSSRWrapper>
      <Typography variant="h1">Audio Converter</Typography>
      <App />
    </NoSSRWrapper>
  );
}
