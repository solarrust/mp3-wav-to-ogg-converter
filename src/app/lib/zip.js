import JSZip from "jszip";
import { saveAs } from "file-saver";

async function createZIP(files) {
  const zip = new JSZip();
  files.forEach((file) => {
    zip.file(file.text, file.blob);
  });

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "converted-files.zip");
}

export default createZIP;