import React, { useState, useEffect } from "react";
import transcode from "../../lib/transcode";
import FileInput from "../FileInput/FileInput";
import ConvertButton from "../ConvertButton/ConvertButton";
import Progress from "../Progress/Progress";
import ZipDownloadButton from "../ZipDownloadButton/ZipDownloadButton";
import UploadFilesList from "../UploadFilesList/UploadFilesList";
import DownloadLinksList from "../DownloadLinksList/DownloadLinksList";
import Wrapper from "../Wrapper/Wrapper";

// TODO: Написать тесты на рисование полоски прогресса для разного количества файлов
export default function Converter({ ffmpeg }) {
  const [uploadFiles, setUploadFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [convertProgress, setConvertProgress] = useState(0);
  const [error, setError] = useState(null);

  // TODO: вынести в функцию с параметрами (длина загруженных, длина конвертированных, прогресс)ю Возращать 1 если длины равны
  const fileRatio = uploadFiles.length > 0 ? 1 / uploadFiles.length : 0;
  const progress = fileRatio * (convertedFiles.length + convertProgress);

  function handleInputChange(files) {
    resetStates();
    setUploadFiles(files);
  }

  function resetStates() {
    setError(null);
    setUploadFiles([]);
    setConvertedFiles([]);
    setConvertProgress(0);
  }

  useEffect(() => {
    ffmpeg.on("progress", ({ progress }) => {
      setConvertProgress(progress);
    });
  }, [ffmpeg]);

  async function convert(file) {
    const link = await transcode(ffmpeg, file);

    setConvertedFiles((prev) => [...prev, link]);
    setConvertProgress(0);
  }

  async function convertFiles() {
    try {
      for (const file of uploadFiles) {
        await convert(file);
      }
    } catch (er) {
      setError(er);
    }
  }

  return (
    <div className="converter">
      <FileInput onChange={handleInputChange} />
      <UploadFilesList files={uploadFiles} />
      {uploadFiles.length > 0 && (
        <Wrapper>
          <ConvertButton onClick={convertFiles} />
          {error && <p className="error">{error.message}</p>}
          <Progress value={progress} />
        </Wrapper>
      )}
      <DownloadLinksList files={convertedFiles} />
      {convertedFiles.length === uploadFiles.length && (
        <ZipDownloadButton files={convertedFiles} />
      )}
    </div>
  );
}
