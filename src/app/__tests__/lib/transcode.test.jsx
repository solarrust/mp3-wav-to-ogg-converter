import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchFile } from "@ffmpeg/util";
import transcode from "../../lib/transcode";

vi.mock("@ffmpeg/util", () => ({
  fetchFile: vi.fn(),
}));

beforeEach(() => {
  global.URL.createObjectURL = vi.fn();
});

describe("transcode function", () => {
  let mockFfmpeg;
  let mockFile;

  beforeEach(() => {
    // Mock the ffmpeg object with writeFile, exec, and readFile functions
    mockFfmpeg = {
      writeFile: vi.fn().mockResolvedValue(),
      exec: vi.fn().mockResolvedValue(),
      readFile: vi.fn().mockResolvedValue(new Uint8Array([0x01, 0x02, 0x03])),
    };

    // Mock the file object
    mockFile = new File(["dummy content"], "test.mp3", {
      type: "audio/mp3",
    });

    fetchFile.mockResolvedValue(new Uint8Array([0x01, 0x02, 0x03]));

    // Mock performance.now() to simulate time taken for transcoding
    vi.spyOn(global.performance, "now")
      .mockReturnValueOnce(1000) // Initial time before transcoding
      .mockReturnValueOnce(1500); // Final time after transcoding

    // Mock the Blob constructor to verify that it's called with correct arguments
    global.Blob = vi.fn().mockImplementation((data, options) => ({
      data,
      options,
    }));
  });

  it("transcodes a file and returns the download link", async () => {
    const result = await transcode(mockFfmpeg, mockFile);

    // Verify that ffmpeg.writeFile was called with correct arguments
    expect(mockFfmpeg.writeFile).toHaveBeenCalledWith(
      "test.mp3",
      expect.any(Uint8Array),
    );

    // Verify that ffmpeg.exec was called with the correct transcoding command
    expect(mockFfmpeg.exec).toHaveBeenCalledWith([
      "-i",
      "test.mp3",
      "test.ogg",
    ]);

    // Verify that ffmpeg.readFile was called with the correct output file name
    expect(mockFfmpeg.readFile).toHaveBeenCalledWith("test.ogg");

    // Verify that a Blob was created with the correct buffer and mime type
    expect(global.Blob).toHaveBeenCalledWith([expect.any(ArrayBuffer)], {
      type: "audio/ogg",
    });

    // Verify the structure of the returned link object
    expect(result).toEqual({
      blob: expect.any(Object),
      text: "test.ogg",
      download: "test.ogg",
    });
  });

  it("handles different file types", async () => {
    // Mock a WAV file input
    const wavFile = new File(["dummy content"], "test.wav", {
      type: "audio/wav",
    });

    await transcode(mockFfmpeg, wavFile);

    // Verify that ffmpeg.writeFile was called with the correct WAV file name
    expect(mockFfmpeg.writeFile).toHaveBeenCalledWith(
      "test.wav",
      expect.any(Uint8Array),
    );

    // Verify that ffmpeg.exec was called with the correct output file name
    expect(mockFfmpeg.exec).toHaveBeenCalledWith([
      "-i",
      "test.wav",
      "test.ogg",
    ]);
  });

  it("logs the time consumed for transcoding", async () => {
    const consoleLogSpy = vi.spyOn(console, "log");

    await transcode(mockFfmpeg, mockFile);

    // Verify that the time consumed for transcoding is logged correctly
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Time for converting test file: 500",
    );

    consoleLogSpy.mockRestore();
  });

  it("calculates the time taken using performance.now()", async () => {
    await transcode(mockFfmpeg, mockFile);

    // Ensure that performance.now() was called twice (before and after transcoding)
    expect(performance.now).toHaveBeenCalledTimes(2);

    // Verify that the time difference is calculated correctly
    const initialTime = performance.now.mock.results[0].value;
    const finalTime = performance.now.mock.results[1].value;

    expect(finalTime - initialTime).toBe(500);
  });
});
