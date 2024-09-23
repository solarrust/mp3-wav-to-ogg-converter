"use client"

import NoSSRWrapper from "./components/NoSSRWrapper";
import Converter from './components/Converter';
import React from 'react';
import { Typography } from '@mui/material';

export default function Home() {
  return (
    <NoSSRWrapper>
      <Typography variant="h1">Audio Converter</Typography>
      <Converter />
    </NoSSRWrapper>
  );
}
