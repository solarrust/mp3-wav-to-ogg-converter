import React, { useState, useRef, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import loadWasm from "../lib/loadWasm";
import transcode from "../lib/transcode";
import FileInput from "./FileInput";
import ConvertButton from "./ConvertButton";
import Progress from "./Progress";
import ZipDownloadButton from "./ZipDownloadButton";
import { Typography } from "@mui/material";
import UploadFilesList from "./UploadFilesList";
import DownloadLinksList from "./DownloadLinksList";

export default function Converter() {
  const [uploadFiles, setUploadFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [convertProgress, setConvertProgress] = useState(0);
  const ffmpegRef = useRef(new FFmpeg());

  function handleInputChange(event) {
    resetStates();
    setUploadFiles(Array.from(event.target.files));
  }

  function resetStates() {
    setUploadFiles([]);
    setConvertedFiles([]);
    setConvertProgress(0);
  }

  const loadFfmpeg = async () => {
    await loadWasm(ffmpegRef.current);
    setLoaded(true);
  };

  useEffect(() => {
    loadFfmpeg();
  }, []);

  const converting = async (file) => {
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("progress", ({ progress, time }) => {
      setConvertProgress(progress);
    });

    const link = await transcode(ffmpeg, file);

    setConvertedFiles((prev) => [...prev, link]);
  };

  const convertingFiles = () => {
    uploadFiles.map((file) => converting(file));
  };

  return loaded ? (
    <div className="converter">
      <FileInput onChange={handleInputChange} />
      {uploadFiles.length > 0 && (
        <>
          <UploadFilesList files={uploadFiles} />
          <div className="converter__wrapper">
            <ConvertButton onClick={convertingFiles} />
            <Progress value={convertProgress} />
          </div>
          <DownloadLinksList files={convertedFiles} />
        </>
      )}
      {convertedFiles.length === uploadFiles.length && (
        <ZipDownloadButton files={convertedFiles} />
      )}
    </div>
  ) : (
    <Typography className="converter__preview" variant="subtitle1">
      Launching the system 🚀
    </Typography>
  );
}
