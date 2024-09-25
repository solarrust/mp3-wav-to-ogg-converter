import JSZip from "jszip";
import { saveAs } from "file-saver";

function createZIP(files) {
  const zip = new JSZip();

  files.map((file) => zip.file(file.text, file.blob));

  zip
    .generateAsync({ type: "blob" })
    .then((blob) => saveAs(blob, "converted-files.zip"));
}

export default createZIP;