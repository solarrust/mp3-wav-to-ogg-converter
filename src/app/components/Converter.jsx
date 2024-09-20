import React, { useState, useRef, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import FileInput from "./FileInput";
import ConvertButton from "./ConvertButton";
import Progress from "./Progress";
import DownloadLink from "./DownloadLink";
import AudioPlayer from "./AudioPlayer";

function returnFileSize(number) {
  if (number < 1e3) {
    return `${number} bytes`;
  } else if (number >= 1e3 && number < 1e6) {
    return `${(number / 1e3).toFixed(1)} KB`;
  } else {
    return `${(number / 1e6).toFixed(1)} MB`;
  }
}

export default function Converter() {
  const [uploadFile, setUploadFile] = useState({});
  const [fileName, setFileName] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const downloadLink = useRef(null);
  const [convertProgress, setConvertProgress] = useState(0);

  function handleInputChange(event) {
    const file = event.target.files[0];
    const fileName = file.name.slice(0, file.name.indexOf("."));

    setUploadFile(file);
    setFileName(fileName);
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

  const transcode = async () => {
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("progress", ({ progress, time }) => {
      setConvertProgress(progress * 100);
    });
    let inputFileName = "input.mp3";

    if (uploadFile.type === "audio/wav") {
      inputFileName = "input.wav";
    }

    await ffmpeg.writeFile(inputFileName, await fetchFile(uploadFile));
    await ffmpeg.exec(["-i", inputFileName, "output.ogg"]);
    const data = await ffmpeg.readFile("output.ogg");
    if (audioRef.current) {
      audioRef.current.src = URL.createObjectURL(
        new Blob([data.buffer], { type: "audio/ogg" }),
      );
    }

    downloadLink.current.href = URL.createObjectURL(
      new Blob([data.buffer], { type: "audio/ogg" }),
    );
    downloadLink.current.innerHTML = `Скачать ${fileName}.ogg`;
    downloadLink.current.download = `${fileName}.ogg`;
  };

  console.log(convertProgress);

  return loaded ? (
    <div className="converter">
      <FileInput onChange={handleInputChange} />
      <ul className="converter__files-list">{uploadFile.name}</ul>
      <ConvertButton onClick={transcode} />
      <Progress value={convertProgress} />
      <DownloadLink ref={downloadLink} />
      <AudioPlayer ref={audioRef} />
    </div>
  ) : (
    <p className="converter__preview">Система запускается 🚀</p>
  );
}
