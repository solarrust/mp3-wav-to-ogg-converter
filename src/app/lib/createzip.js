import JSZip from "jszip";
import { saveAs } from "file-saver";

export default async function createZIP(files) {
  const zip = new JSZip();

  try {
    files.forEach((file) => {
      zip.file(file.text, file.blob);
    });
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "converted-files.zip");
  } catch (error) {
    throw error;
  }
}
