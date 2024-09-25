import React, { useState, useRef, useEffect } from "react";
import loadWasm from "../lib/loadWasm";
import { Typography } from "@mui/material";
import Converter from "./Converter"

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef(null);

  const loadFfmpeg = async () => {
    ffmpegRef.current = await loadWasm();
    setLoaded(true);
  };

  useEffect(() => {
    loadFfmpeg();
  }, []);

  return loaded ? (
    <Converter ffmpeg={ffmpegRef.current} />
  ) : (
    <Typography className="converter__preview" variant="subtitle1">
      Launching the system 🚀
    </Typography>
  );
}