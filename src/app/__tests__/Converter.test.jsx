import React from "react";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Converter from "../components/Converter";
import { FFmpeg } from "@ffmpeg/ffmpeg";

beforeEach(() => {
  global.URL.createObjectURL = vi.fn();
});

afterEach(() => {
  cleanup();
});

vi.mock("@ffmpeg/ffmpeg", () => {
  const mockFFmpeg = {
    load: vi.fn().mockResolvedValue(),
    writeFile: vi.fn().mockResolvedValue(),
    exec: vi.fn().mockResolvedValue(),
    readFile: vi.fn().mockResolvedValue(new Uint8Array()),
    on: vi.fn(),
  };

  return {
    FFmpeg: vi.fn().mockImplementation(() => mockFFmpeg),
  };
});

describe("Converter Component", () => {
  let file;

  beforeEach(() => {
    file = new File(["dummy content"], "test.mp3", {
      type: "audio/mpeg",
    });
  });

  it("renders 'Launching the system' message before ffmpeg is loaded", () => {
    render(<Converter />);
    expect(screen.getByText("Launching the system 🚀")).toBeInTheDocument();
  });

  it("renders file input after ffmpeg is loaded", async () => {
    render(<Converter />);

    await waitFor(() =>
      expect(
        screen.queryByText("Launching the system 🚀"),
      ).not.toBeInTheDocument(),
    );

    expect(document.querySelector('input[type="file"]')).toBeInTheDocument();
  });

  it("handles file input and displays uploaded files", async () => {
    render(<Converter />);

    await waitFor(() => {
      expect(
        screen.queryByText("Launching the system 🚀"),
      ).not.toBeInTheDocument();
    });

    const fileInput = document.querySelector('input[type="file"]');

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText("test.mp3")).toBeInTheDocument();
  });

  it("starts conversion when the Convert button is clicked", async () => {
    render(<Converter />);

    await waitFor(() => {
      expect(
        screen.queryByText("Launching the system 🚀"),
      ).not.toBeInTheDocument();
    });

    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [file] } });

    const convertButton = screen.getByText("Convert into OGG");
    fireEvent.click(convertButton);

    await waitFor(() => {
      const mockFFmpeg = FFmpeg.mock.results[0].value;
      expect(mockFFmpeg.load).toHaveBeenCalled();
      expect(mockFFmpeg.writeFile).toHaveBeenCalledWith(
        "test.mp3",
        expect.anything(),
      );
      expect(mockFFmpeg.exec).toHaveBeenCalledWith([
        "-i",
        "test.mp3",
        "test.ogg",
      ]);
      expect(mockFFmpeg.readFile).toHaveBeenCalledWith("test.ogg");
    });
  });

  it("shows download links after conversion", async () => {
    render(<Converter />);

    await waitFor(() => {
      expect(
        screen.queryByText("Launching the system 🚀"),
      ).not.toBeInTheDocument();
    });

    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [file] } });

    const convertButton = screen.getByText("Convert into OGG");
    fireEvent.click(convertButton);

    await waitFor(() => {
      expect(screen.getByText("Download test.ogg")).toBeInTheDocument();
    });
  });

  it("renders ZipDownloadLink when all files are converted", async () => {
    render(<Converter />);

    await waitFor(() => {
      expect(
        screen.queryByText("Launching the system 🚀"),
      ).not.toBeInTheDocument();
    });

    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [file] } });

    const convertButton = screen.getByText("Convert into OGG");
    fireEvent.click(convertButton);

    await waitFor(() => {
      expect(screen.getByText("Download ZIP")).toBeInTheDocument();
    });
  });
});
