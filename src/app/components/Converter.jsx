import React, { useState, useEffect } from "react";
import transcode from "../lib/transcode";
import FileInput from "./FileInput";
import ConvertButton from "./ConvertButton";
import Progress from "./Progress";
import ZipDownloadButton from "./ZipDownloadButton";
import UploadFilesList from "./UploadFilesList";
import DownloadLinksList from "./DownloadLinksList";

export default function Converter({ ffmpeg }) {
  const [uploadFiles, setUploadFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [convertProgress, setConvertProgress] = useState(0);

  function handleInputChange(event) {
    resetStates();
    setUploadFiles(Array.from(event.target.files));
  }

  function resetStates() {
    setUploadFiles([]);
    setConvertedFiles([]);
    setConvertProgress(0);
  }

  useEffect(() => {
    ffmpeg.on("progress", ({ progress, time }) => {
      setConvertProgress(progress);
    });
  }, []);

  const converting = async (file) => {
    const link = await transcode(ffmpeg, file);

    setConvertedFiles((prev) => [...prev, link]);
  };

  const convertingFiles = () => {
    uploadFiles.map((file) => converting(file));
  };

  return (
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
  );
}
