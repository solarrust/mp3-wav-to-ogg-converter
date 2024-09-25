const { fetchFile } = require('@ffmpeg/util');

const transcode = async (ffmpeg, file) => {
  const start = performance.now();

  const fileName = file.name.slice(0, file.name.lastIndexOf("."));
  let inputFileName = `${fileName}.mp3`;

  if (file.type === "audio/wav") {
    inputFileName = `${fileName}.wav`;
  }

  const outputFileName = `${fileName}.ogg`;

  await ffmpeg.writeFile(inputFileName, await fetchFile(file));
  await ffmpeg.exec(["-i", inputFileName, outputFileName]);
  const data = await ffmpeg.readFile(outputFileName);

  const link = {
    blob: new Blob([data.buffer], { type: "audio/ogg" }),
    text: outputFileName,
    download: outputFileName,
  };

  const timeConsumed = performance.now() - start;
  console.log(`Time for converting ${fileName} file: ${timeConsumed}`);

  return link;
}

export default transcode