"use client";

import NoSSRWrapper from "./components/NoSSRWrapper/NoSSRWrapper";
import App from "./components/App/App";
import React from "react";

export default function Home() {
  return (
    <NoSSRWrapper>
      <h1 className="title">Audio Converter</h1>
      <App />
    </NoSSRWrapper>
  );
}
