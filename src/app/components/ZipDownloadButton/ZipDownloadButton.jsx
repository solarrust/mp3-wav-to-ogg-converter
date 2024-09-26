import React, { useState } from "react";
import Button from "@mui/material/Button";
import createZIP from "../../lib/createzip";

// TODO: Вывести ошибку в интерфейс
export default function ZipDownloadButton({ files }) {
  if (!files.length) return null;

  function onClick() {
    createZIP(files);
  }

  return (
    <>
      <Button variant="contained" onClick={onClick}>
        Download ZIP
      </Button>
    </>
  );
}
