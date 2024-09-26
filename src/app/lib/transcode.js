import { fetchFile } from '@ffmpeg/util';

const transcode = async (ffmpeg, file) => {
  const fileName = file.name.slice(0, file.name.lastIndexOf("."));

  const outputFileName = `${fileName}.ogg`;

  const start = performance.now();

  await ffmpeg.writeFile(file.name, await fetchFile(file));
  await ffmpeg.exec(["-i", file.name, outputFileName]);
  const data = await ffmpeg.readFile(outputFileName);

  const timeConsumed = performance.now() - start;
  console.log(`Time for converting ${fileName} file: ${timeConsumed}`);

  const blob = new Blob([data.buffer], { type: "audio/ogg" });

  return {
    blob: blob,
    text: outputFileName,
    download: outputFileName,
    href: URL.createObjectURL(blob)
  };
}

export default transcode