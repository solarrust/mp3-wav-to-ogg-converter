import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import UploadFilesList from "./UploadFilesList";

afterEach(() => {
  cleanup();
});

describe("UploadFilesList Component", () => {
  let files;

  beforeEach(() => {
    files = [
      new File(["file content"], "file1.mp3", { type: "audio/mp3" }),
      new File(["file content"], "file2.mp3", { type: "audio/mp3" }),
    ];
  });

  it("renders a list of uploaded files", () => {
    render(<UploadFilesList files={files} />);

    // Verify that the correct number of list items are rendered
    const listItems = screen.getAllByRole("listitem");
    expect(listItems.length).toBe(2);

    // Verify that the correct file names are displayed
    expect(screen.getByText("file1.mp3")).toBeInTheDocument();
    expect(screen.getByText("file2.mp3")).toBeInTheDocument();
  });

  it("renders an empty list when no files are uploaded", () => {
    render(<UploadFilesList files={[]} />);

    // Verify that no list items are rendered
    const listItems = screen.queryAllByRole("listitem");
    expect(listItems.length).toBe(0);
  });
});
