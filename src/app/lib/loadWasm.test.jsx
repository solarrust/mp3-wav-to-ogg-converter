import { describe, it, expect, vi, beforeEach } from "vitest";
import loadWasm from "./loadWasm";

let mockFFmpeg;

vi.mock("@ffmpeg/ffmpeg", () => ({
  FFmpeg: vi.fn().mockImplementation(() => mockFFmpeg),
}));

describe("loadWasm function", () => {
  beforeEach(() => {
    mockFFmpeg = {
      load: vi.fn().mockResolvedValue(),
      on: vi.fn().mockRejectedValue(),
    };
  });

  it("calls ffmpeg.load() and returns the ffmpeg instance", async () => {
    const ffmpeg = await loadWasm();

    expect(ffmpeg.load).toHaveBeenCalled();
    expect(ffmpeg).toHaveProperty("load");
  });

  it("throws an error if ffmpeg.load() fails", async () => {
    const errorMessage = "Failed to load";
    mockFFmpeg.load.mockRejectedValueOnce(new Error(errorMessage));

    await expect(loadWasm()).rejects.toThrow(errorMessage);
  });
});
