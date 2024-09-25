import { describe, it, expect, vi, beforeEach } from "vitest";
import loadWasm from "../../lib/loadWasm";

describe("loadWasm function", () => {
  let mockFfmpeg;

  beforeEach(() => {
    // Mock the ffmpeg object with a load function
    mockFfmpeg = {
      load: vi.fn().mockResolvedValue(),
    };

    // Mock performance.now() to control the timing
    vi.spyOn(global.performance, "now")
      .mockReturnValueOnce(1000) // Initial time before loading
      .mockReturnValueOnce(1500); // Final time after loading
  });

  it("calls ffmpeg.load() and logs the time consumed", async () => {
    const consoleLogSpy = vi.spyOn(console, "log");

    await loadWasm(mockFfmpeg);

    // Check that ffmpeg.load() was called
    expect(mockFfmpeg.load).toHaveBeenCalled();

    // Check that the time consumed was calculated and logged
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Time for loading ffmpeg.wasm: 500",
    );

    // Clean up the spy on console.log
    consoleLogSpy.mockRestore();
  });

  it("calculates the time taken using performance.now()", async () => {
    await loadWasm(mockFfmpeg);

    // Ensure that performance.now() was called twice (before and after load)
    expect(performance.now).toHaveBeenCalledTimes(2);

    // Verify that the time difference is calculated correctly
    const initialTime = performance.now.mock.results[0].value;
    const finalTime = performance.now.mock.results[1].value;

    expect(finalTime - initialTime).toBe(500);
  });
});
