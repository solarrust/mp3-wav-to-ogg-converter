import React, { useState, useRef, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import FileInput from "./FileInput";
import ConvertButton from "./ConvertButton";
import Progress from "./Progress";
import DownloadLink from "./DownloadLink";
import ZipDownloadLink from "./ZipDownloadLink";
import { Typography } from "@mui/material";
import UploadFilesList from "./UploadFilesList";
import DownloadLinksList from "./DownloadLinksList";

export default function Converter() {
  const [uploadFiles, setUploadFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [convertProgress, setConvertProgress] = useState(0);
  const ffmpegRef = useRef(new FFmpeg());

  function handleInputChange(event) {
    reset();
    setUploadFiles(Array.from(event.target.files));
  }

  function reset() {
    setUploadFiles([]);
    setConvertedFiles([]);
    setConvertProgress(0);
  }

  const load = async () => {
    const start = performance.now();
    setIsLoading(true);
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.load();
    setLoaded(true);
    setIsLoading(false);
    const timeConsumed = performance.now() - start;
    console.log(`Time for loading ffmpeg.wasm: ${timeConsumed}`);
  };

  useEffect(() => {
    load();
  }, []);

  const transcode = async (file) => {
    const start = performance.now();

    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("progress", ({ progress, time }) => {
      setConvertProgress(progress);
    });
    const fileName = file.name.slice(0, file.name.lastIndexOf("."));
    let inputFileName = `${fileName}.mp3`;

    if (file.type === "audio/wav") {
      inputFileName = `${fileName}.wav`;
    }

    const outputFileName = `${fileName}.ogg`;

    await ffmpeg.writeFile(inputFileName, await fetchFile(file));
    await ffmpeg.exec(["-i", inputFileName, outputFileName]);
    const data = await ffmpeg.readFile(outputFileName);

    const link = {
      blob: new Blob([data.buffer], { type: "audio/ogg" }),
      text: outputFileName,
      download: outputFileName,
    };

    setConvertedFiles((prev) => [...prev, link]);

    const timeConsumed = performance.now() - start;
    console.log(`Time for converting ${fileName} file: ${timeConsumed}`);
  };

  const convertingFiles = () => {
    uploadFiles.map((file, index) => transcode(file));
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
          <DownloadLinksList files={convertedFiles}/>
        </>
      )}
      {convertedFiles.length === uploadFiles.length && (
        <ZipDownloadLink files={convertedFiles} />
      )}
    </div>
  ) : (
    <Typography className="converter__preview" variant="subtitle1">
      Launching the system 🚀
    </Typography>
  );
}
