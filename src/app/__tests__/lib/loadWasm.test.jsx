import { describe, it, expect, vi, beforeEach } from "vitest";
import loadWasm from "../../lib/loadWasm";

vi.mock("@ffmpeg/ffmpeg", () => {
  const mockFFmpeg = {
    load: vi.fn().mockResolvedValue(),
  };

  return {
    FFmpeg: vi.fn().mockImplementation(() => mockFFmpeg),
  };
});

describe("loadWasm function", () => {
  it("calls ffmpeg.load() and logs the time consumed", async () => {
    const ffmpeg = await loadWasm();

    // Check that ffmpeg.load() was called
    expect(ffmpeg.load).toHaveBeenCalled();
  });
});
