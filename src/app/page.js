"use client"

import NoSSRWrapper from "./components/NoSSRWrapper";
import Converter from './components/Converter';
import React from 'react';

export default function Home() {
  return (
    <NoSSRWrapper><Converter /></NoSSRWrapper>
  );
}
