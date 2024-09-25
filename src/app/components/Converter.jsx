import React, { useState, useEffect } from "react";
import transcode from "../lib/transcode";
import FileInput from "./FileInput";
import ConvertButton from "./ConvertButton";
import Progress from "./Progress";
import ZipDownloadButton from "./ZipDownloadButton";
import UploadFilesList from "./UploadFilesList";
import DownloadLinksList from "./DownloadLinksList";

// TODO: Написать тесты на рисование полоски прогресса для разного количества файлов
export default function Converter({ ffmpeg }) {
  const [uploadFiles, setUploadFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [convertProgress, setConvertProgress] = useState(0);

  const fileRatio = uploadFiles.length > 0 ? 1 / uploadFiles.length : 0;
  const progress = fileRatio * (convertedFiles.length + convertProgress);

  function handleInputChange(files) {
    resetStates();
    setUploadFiles(files);
  }

  function resetStates() {
    setUploadFiles([]);
    setConvertedFiles([]);
    setConvertProgress(0);
  }

  useEffect(() => {
    ffmpeg.on("progress", ({ progress }) => {
      setConvertProgress(progress);
    });
  }, []);

  const converting = async (file) => {
    const link = await transcode(ffmpeg, file);

    setConvertedFiles((prev) => [...prev, link]);
    setConvertProgress(0);
  };

  const convertingFiles = async () => {
    for (const file of uploadFiles) {
      await converting(file);
    }
  };

  return (
    <div className="converter">
      <FileInput onChange={handleInputChange} />
      {uploadFiles.length > 0 && (
        <>
          <UploadFilesList files={uploadFiles} />
          <div className="converter__wrapper">
            <ConvertButton onClick={convertingFiles} />
            <Progress value={progress} />
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
