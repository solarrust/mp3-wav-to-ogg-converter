import React from "react";
import Button from "@mui/material/Button";
import createZIP from "../../lib/zip";

export default function ZipDownloadLink({ files }) {
  if (!files.length) return null;

  function onClick() {
    createZIP(files);
  }

  return (
    <Button variant="contained" onClick={onClick}>
      Download ZIP
    </Button>
  );
}
