import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchFile } from "@ffmpeg/util";
import transcode from "./transcode";

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

    // Mock the Blob constructor to verify that it's called with correct arguments
    global.Blob = vi.fn().mockImplementation((data, options) => ({
      data,
      options,
    }));
  });

  it("transcodes a file and returns the download link", async () => {
    const result = await transcode(mockFfmpeg, mockFile);

    // TODO: Проверить что в blob не any, а конкретное значение из writeFile
    // TODO: Добавить href в поля объекта
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

  it("throws an error if ffmpeg.exec fails", async () => {
    const errorMessage = "Transcoding failed";
    const wavFile = new File(["dummy content"], "test.wav", {
      type: "audio/wav",
    });

    // Mock ffmpeg.exec to throw an error
    mockFfmpeg.exec.mockRejectedValueOnce(new Error(errorMessage));

    await expect(transcode(mockFfmpeg, wavFile)).rejects.toThrow(errorMessage);
  });
});
