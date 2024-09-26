import React, { useState, useEffect } from "react";
import transcode from "../../lib/transcode";
import FileInput from "../FileInput/FileInput";
import ConvertButton from "../ConvertButton/ConvertButton";
import Progress from "../Progress/Progress";
import ZipDownloadButton from "../ZipDownloadButton/ZipDownloadButton";
import UploadFilesList from "../UploadFilesList/UploadFilesList";
import DownloadLinksList from "../DownloadLinksList/DownloadLinksList";

// TODO: Написать тесты на рисование полоски прогресса для разного количества файлов
export default function Converter({ ffmpeg }) {
  const [uploadFiles, setUploadFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [convertProgress, setConvertProgress] = useState(0);

  // TODO: вынести в функцию с параметрами (длина загруженных, длина конвертированных, прогресс)ю Возращать 1 если длины равны
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

  const convert = async (file) => {
    const link = await transcode(ffmpeg, file);

    setConvertedFiles((prev) => [...prev, link]);
    setConvertProgress(0);
  };

  const convertFiles = async () => {
    for (const file of uploadFiles) {
      await convert(file);
    }
  };

  return (
    <div className="converter">
      <FileInput onChange={handleInputChange} />
      <UploadFilesList files={uploadFiles} />
      {uploadFiles.length > 0 && (
        <div className="converter__wrapper">
          <ConvertButton onClick={convertFiles} />
          <Progress value={progress} />
        </div>
      )}
      <DownloadLinksList files={convertedFiles} />
      {convertedFiles.length === uploadFiles.length && (
        <ZipDownloadButton files={convertedFiles} />
      )}
    </div>
  );
}
