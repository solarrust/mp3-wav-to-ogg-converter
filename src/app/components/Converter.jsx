import React, { useState, useRef, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import FileInput from "./FileInput";
import ConvertButton from "./ConvertButton";
import Progress from "./Progress";
import DownloadLink from "./DownloadLink";
import { Typography } from "@mui/material";
import ZipDownloadLink from "./ZipDownloadLink";

export default function Converter() {
  const [uploadFiles, setUploadFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const [convertProgress, setConvertProgress] = useState(0);

  function handleInputChange(event) {
    setUploadFiles([]);
    setConvertedFiles([]);
    setConvertProgress(0);
    setUploadFiles(Array.from(event.target.files));
  }

  const load = async () => {
    setIsLoading(true);
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.load();
    setLoaded(true);
    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const transcode = async (file, index) => {
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("progress", ({ progress, time }) => {
      setConvertProgress(progress);
    });
    const fileName = file.name.slice(0, file.name.lastIndexOf("."));
    let inputFileName = `${fileName}.mp3"`;

    if (file.type === "audio/wav") {
      inputFileName = `${fileName}.wav"`;
    }

    await ffmpeg.writeFile(inputFileName, await fetchFile(file));
    await ffmpeg.exec(["-i", inputFileName, `${fileName}.ogg`]);
    const data = await ffmpeg.readFile(`${fileName}.ogg`);

    const link = {
      blob: new Blob([data.buffer], { type: "audio/ogg" }),
      text: `${fileName}.ogg`,
      download: `${fileName}.ogg`,
    };

    setConvertedFiles((prev) => [...prev, link]);
  };

  const convertFiles = () => {
    uploadFiles.map((file, index) => transcode(file, index));
  };

  const FilesListItems =
    uploadFiles.length > 0
      ? uploadFiles.map((file, index) => (
          <li key={file.name + index}>{file.name}</li>
        ))
      : "No files";

  const DownloadLinksList =
    convertedFiles.length > 0
      ? convertedFiles.map((file, index) => (
          <li key={index + file.text} className="converter__links-item">
            <DownloadLink
              href={URL.createObjectURL(
                new Blob([file.blob], { type: "audio/ogg" }),
              )}
              text={file.text}
              download={file.download}
            />
          </li>
        ))
      : "";

  const ConvertProcess =
    uploadFiles.length > 0 ? (
      <>
        <ul className="converter__files-list">{FilesListItems}</ul>
        <ConvertButton onClick={convertFiles} />{" "}
        <Progress value={convertProgress} />
      </>
    ) : (
      ""
    );

  const convertResult =
    convertedFiles.length === uploadFiles.length ? (
      <>
        <ul className="converter__links-list">{DownloadLinksList}</ul>
        <ZipDownloadLink files={convertedFiles} />
      </>
    ) : (
      ""
    );

  return loaded ? (
    <div className="converter">
      <FileInput onChange={handleInputChange} />
      {ConvertProcess}
      {convertResult}
    </div>
  ) : (
    <Typography className="converter__preview" variant="subtitle1">
      Launching the system 🚀
    </Typography>
  );
}
