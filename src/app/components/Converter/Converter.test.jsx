import React from "react";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Converter from "./Converter";

beforeEach(() => {
  global.URL.createObjectURL = vi.fn();
});

afterEach(() => {
  cleanup();
});

describe("Converter Component", () => {
  let mockFFmpeg;
  let file;
  const label = "Choose files";

  beforeEach(() => {
    file = new File(["dummy content"], "test.mp3", {
      type: "audio/mpeg",
    });

    mockFFmpeg = {
      writeFile: vi.fn().mockResolvedValue(),
      exec: vi.fn().mockResolvedValue(),
      readFile: vi.fn().mockResolvedValue(new Uint8Array()),
      on: vi.fn(),
    };
  });

  it("renders file input after ffmpeg is loaded", async () => {
    render(<Converter ffmpeg={mockFFmpeg} />);

    expect(screen.getByLabelText(label)).toBeInTheDocument();
  });

  it("handles file input and displays uploaded files", async () => {
    render(<Converter ffmpeg={mockFFmpeg} />);

    const fileInput = screen.getByLabelText(label);

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText("test.mp3")).toBeInTheDocument();
  });

  it("starts conversion when the Convert button is clicked", async () => {
    render(<Converter ffmpeg={mockFFmpeg} />);

    const fileInput = screen.getByLabelText(label);
    fireEvent.change(fileInput, { target: { files: [file] } });

    const convertButton = screen.getByText("Convert into OGG");
    fireEvent.click(convertButton);

    await waitFor(() => {
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
    render(<Converter ffmpeg={mockFFmpeg} />);

    const fileInput = screen.getByLabelText(label);
    fireEvent.change(fileInput, { target: { files: [file] } });

    const convertButton = screen.getByText("Convert into OGG");
    fireEvent.click(convertButton);

    await waitFor(() => {
      expect(screen.getByText("Download test.ogg")).toBeInTheDocument();
    });
  });

  it("renders ZipDownloadLink when all files are converted", async () => {
    render(<Converter ffmpeg={mockFFmpeg} />);

    const fileInput = screen.getByLabelText(label);
    fireEvent.change(fileInput, { target: { files: [file] } });

    const convertButton = screen.getByText("Convert into OGG");
    fireEvent.click(convertButton);

    await waitFor(() => {
      expect(screen.getByText("Download ZIP")).toBeInTheDocument();
    });
  });

  it("displays an error message if convert(file) fails", async () => {
    const errorMessage = "Conversion failed";
    mockFFmpeg.exec.mockRejectedValueOnce(new Error(errorMessage));

    render(<Converter ffmpeg={mockFFmpeg} />);

    const fileInput = screen.getByLabelText(label);
    fireEvent.change(fileInput, { target: { files: [file] } });

    const convertButton = screen.getByText("Convert into OGG");
    fireEvent.click(convertButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
