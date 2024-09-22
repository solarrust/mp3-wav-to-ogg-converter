import React, { useState, useRef, useEffect } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import FileInput from "./FileInput";
import ConvertButton from "./ConvertButton";
import Progress from "./Progress";
import DownloadLink from "./DownloadLink";
import Button from "@mui/material/Button";

export default function Converter() {
  const [uploadFiles, setUploadFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  // const audioRef = useRef(null);
  // const downloadLink = useRef(null);
  const [convertProgress, setConvertProgress] = useState(0);

  function handleInputChange(event) {
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

  const transcode = async (file) => {
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("progress", ({ progress, time }) => {
      setConvertProgress(progress * 100);
    });
    const fileName = file.name.slice(0, file.name.lastIndexOf("."));
    let inputFileName = "input.mp3";

    if (file.type === "audio/wav") {
      inputFileName = "input.wav";
    }

    await ffmpeg.writeFile(inputFileName, await fetchFile(file));
    await ffmpeg.exec(["-i", inputFileName, "output.ogg"]);
    const data = await ffmpeg.readFile("output.ogg");

    const link = {
      href: URL.createObjectURL(new Blob([data.buffer], { type: "audio/ogg" })),
      text: `${fileName}.ogg`,
      download: `${fileName}.ogg`,
    };

    setConvertedFiles((prev) => [...prev, link]);
  };

  const convertFiles = () => {
    return uploadFiles.map((file) => transcode(file));
  };

  const FilesListItems =
    uploadFiles.length > 0
      ? uploadFiles.map((file, index) => (
          <li key={file.name + index}>{file.name}</li>
        ))
      : "Файлы не выбраны";

  const DownloadLinksList =
    convertedFiles.length > 0
      ? convertedFiles.map((file, index) => (
          <li key={index + file.text} className="converter__links-item">
            <DownloadLink
              href={file.href}
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
        <ul className="converter__links-list">{DownloadLinksList}</ul>
      </>
    ) : (
      ""
    );

  return loaded ? (
    <div className="converter">
      <FileInput onChange={handleInputChange} />
      {ConvertProcess}
    </div>
  ) : (
    <p className="converter__preview">Система запускается 🚀</p>
  );
}
