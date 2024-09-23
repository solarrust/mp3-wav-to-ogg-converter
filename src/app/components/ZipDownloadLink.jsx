import React from "react";
import Button from "@mui/material/Button";

import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function ZipDownloadLink({ files }) {
  function onClick() {
    const zip = new JSZip();

    files.map((file) => zip.file(file.text, file.blob));

    zip
      .generateAsync({ type: "blob" })
      .then((blob) => saveAs(blob, "converted-files.zip"));
    console.log({ zip });
  }

  return files.length > 0 ? (
    <Button variant="contained" onClick={onClick}>
      Download ZIP
    </Button>
  ) : (
    ""
  );
}
