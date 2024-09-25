async function loadWasm(ffmpeg) {
  const start = performance.now();
  await ffmpeg.load();

  const timeConsumed = performance.now() - start;
  console.log(`Time for loading ffmpeg.wasm: ${timeConsumed}`);
}

export default loadWasm;