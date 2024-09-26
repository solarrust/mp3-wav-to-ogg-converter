import React from "react";
import { render, fireEvent, cleanup, screen } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import FileInput from "./FileInput";

afterEach(() => {
  cleanup();
});

function selectFiles(files) {
  const input = screen.getByLabelText("Choose files");
  fireEvent.change(input, { target: { files } });
}

describe("FileInput Component Functionality", () => {
  it("calls onChange when a file is selected", () => {
    const mockOnChange = vi.fn();
    render(<FileInput onChange={mockOnChange} />);

    const file = new File(["audio-content"], "test.mp3", { type: "audio/mp3" });

    selectFiles([file]);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith([file]);
  });

  it("does not call onChange if an unsupported file type is selected", () => {
    const mockOnChange = vi.fn();
    const unsupportedFile = new File(["text-content"], "test.txt", {
      type: "text/plain",
    });

    render(<FileInput onChange={mockOnChange} />);

    selectFiles([unsupportedFile]);

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("show the error if ab unsupported file type is selected", () => {
    const mockOnChange = vi.fn();
    const unsupportedFile = new File(["text-content"], "test.txt", {
      type: "text/plain",
    });

    render(<FileInput onChange={mockOnChange} />);

    selectFiles([unsupportedFile]);

    expect(screen.getByText("Invalid file type")).toBeInTheDocument();
  });

  it("supports selecting multiple files", () => {
    const mockOnChange = vi.fn();
    const file1 = new File(["audio-content1"], "test1.mp3", {
      type: "audio/mp3",
    });
    const file2 = new File(["audio-content2"], "test2.wav", {
      type: "audio/wav",
    });

    render(<FileInput onChange={mockOnChange} />);

    selectFiles([file1, file2]);

    expect(mockOnChange).toHaveBeenCalledWith([file1, file2]);
  });

  it("calls onChange when a file is replaced", () => {
    const mockOnChange = vi.fn();
    const file1 = new File(["audio-content1"], "test1.mp3", {
      type: "audio/mp3",
    });
    const file2 = new File(["audio-content2"], "test2.wav", {
      type: "audio/wav",
    });

    render(<FileInput onChange={mockOnChange} />);

    selectFiles([file1]);
    selectFiles([file2]);

    expect(mockOnChange).toHaveBeenCalledTimes(2);
    expect(mockOnChange).toHaveBeenCalledWith([file2]);
  });
});
