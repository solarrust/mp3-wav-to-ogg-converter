import React, { useState, useEffect } from "react";
import loadWasm from "../lib/loadWasm";
import { Typography } from "@mui/material";
import Converter from "./Converter";

// TODO: написать тесты на компонент
// TODO: показывать ошибки в интерфейсе (во всех компонентах). Где есть промисы и асинк/авейт — обрабатывать обязательно
// TODO: Поправить именование классов внутри компонентов
export default function App() {
  const [ffmpeg, setFfmpeg] = useState(null);
  const [error, setError] = useState({ isError: false, message: "" });

  const loadFfmpeg = async () => {
    let ffmpeg;

    try {
      ffmpeg = await loadWasm();
    } catch (er) {
      setError({ isError: true, message: er.message });
    }

    setFfmpeg(ffmpeg);
  };

  useEffect(() => {
    loadFfmpeg();
  }, []);

  return ffmpeg ? (
    <Converter ffmpeg={ffmpeg} />
  ) : error.isError ? (
    <Typography className="converter__error" variant="subtitle1">
      {error.message}
    </Typography>
  ) : (
    <Typography className="converter__preview" variant="subtitle1">
      Launching the system 🚀
    </Typography>
  );
}
