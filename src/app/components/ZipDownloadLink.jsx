import React from "react";
import Button from "@mui/material/Button";
import createZIP from "../lib/zip";

export default function ZipDownloadLink({ files }) {
  function onClick() {
    createZIP(files);
  }

  return files.length > 0 ? (
    <Button variant="contained" onClick={onClick}>
      Download ZIP
    </Button>
  ) : (
    ""
  );
}
