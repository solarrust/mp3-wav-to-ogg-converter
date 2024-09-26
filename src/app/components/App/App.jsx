import React, { useState, useEffect } from "react";
import loadWasm from "../../lib/loadWasm";
import Converter from "../Converter/Converter";

// TODO: показывать ошибки в интерфейсе (во всех компонентах). Где есть промисы и асинк/авейт — обрабатывать обязательно
export default function App() {
  const [ffmpeg, setFfmpeg] = useState(null);
  const [error, setError] = useState(null);

  async function loadFfmpeg() {
    let ffmpeg;

    try {
      ffmpeg = await loadWasm();
    } catch (e) {
      setError(e);
    }

    setFfmpeg(ffmpeg);
  }

  useEffect(() => {
    loadFfmpeg();
  }, []);

  return ffmpeg ? (
    <Converter ffmpeg={ffmpeg} />
  ) : error ? (
    <p className="error">{error.message}</p>
  ) : (
    <p>Launching the system 🚀</p>
  );
}
