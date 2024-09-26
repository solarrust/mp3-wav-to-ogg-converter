import { FFmpeg } from "@ffmpeg/ffmpeg";

export default async function loadWasm() {
  const start = performance.now();
  const ffmpeg = new FFmpeg()

  try {
    await ffmpeg.load();
  } catch (error) {
    throw error
  }

  const timeConsumed = performance.now() - start;
  console.log(`Time for loading ffmpeg.wasm: ${timeConsumed}`);

  return ffmpeg;
}