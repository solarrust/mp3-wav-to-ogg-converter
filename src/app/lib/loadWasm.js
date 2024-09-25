import { FFmpeg } from "@ffmpeg/ffmpeg";

async function loadWasm() {
  const start = performance.now();
  const ffmpeg = new FFmpeg()
  await ffmpeg.load();

  const timeConsumed = performance.now() - start;
  console.log(`Time for loading ffmpeg.wasm: ${timeConsumed}`);
  return ffmpeg;
}

export default loadWasm;