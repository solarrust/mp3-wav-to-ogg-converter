import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import FileInput from "../components/FileInput";

afterEach(() => {
  cleanup();
});

describe("FileInput Component Functionality", () => {
  it("calls onChange when a file is selected", () => {
    const mockOnChange = vi.fn();
    render(<FileInput onChange={mockOnChange} />);

    const file = new File(["audio-content"], "test.mp3", { type: "audio/mp3" });

    const input = document.querySelector('input[type="file"]');

    fireEvent.change(input, { target: { files: [file] } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(expect.anything());
  });

  it("does not call onChange if an unsupported file type is selected", () => {
    const mockOnChange = vi.fn();
    render(<FileInput onChange={mockOnChange} />);

    const unsupportedFile = new File(["text-content"], "test.txt", {
      type: "text/plain",
    });

    const input = document.querySelector('input[type="file"]');

    fireEvent.change(input, { target: { files: [unsupportedFile] } });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("supports selecting multiple files", () => {
    const mockOnChange = vi.fn();
    render(<FileInput onChange={mockOnChange} />);

    const file1 = new File(["audio-content1"], "test1.mp3", {
      type: "audio/mp3",
    });
    const file2 = new File(["audio-content2"], "test2.wav", {
      type: "audio/wav",
    });

    const input = document.querySelector('input[type="file"]');

    fireEvent.change(input, { target: { files: [file1, file2] } });

    expect(input.files.length).toBe(2);
  });

  it("calls onChange when a file is replaced", () => {
    const mockOnChange = vi.fn();
    render(<FileInput onChange={mockOnChange} />);

    const file1 = new File(["audio-content1"], "test1.mp3", {
      type: "audio/mp3",
    });
    const file2 = new File(["audio-content2"], "test2.wav", {
      type: "audio/wav",
    });

    const input = document.querySelector('input[type="file"]');

    fireEvent.change(input, { target: { files: [file1] } });
    fireEvent.change(input, { target: { files: [file2] } });
  });
});
