import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import DownloadLinksList from "../components/DownloadLinksList";

beforeEach(() => {
  global.URL.createObjectURL = vi.fn();
});

afterEach(() => {
  cleanup();
});

describe("DownloadLinksList Component", () => {
  let files;

  beforeEach(() => {
    files = [
      {
        blob: new Blob([new Uint8Array([0x01, 0x02, 0x03])]),
        text: "File 1",
        download: "file1.ogg",
      },
      {
        blob: new Blob([new Uint8Array([0x04, 0x05, 0x06])]),
        text: "File 2",
        download: "file2.ogg",
      },
    ];
  });

  it("renders a list of download links", () => {
    render(<DownloadLinksList files={files} />);

    // Check that the download links are rendered
    files.forEach((file) => {
      const linkElement = screen.getByText(`Download ${file.text}`);
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute("download", file.download);
    });
  });

  it("calls URL.createObjectURL for each file on click", () => {
    render(<DownloadLinksList files={files} />);

    // Check that URL.createObjectURL is not called initially
    expect(global.URL.createObjectURL).not.toHaveBeenCalled();

    // Simulate clicks on each link
    files.forEach((file) => {
      const linkElement = screen.getByText(`Download ${file.text}`);
      fireEvent.click(linkElement);
    });

    // Check that URL.createObjectURL was called for each file
    expect(global.URL.createObjectURL).toHaveBeenCalledTimes(files.length);
    files.forEach((file, index) => {
      expect(global.URL.createObjectURL).toHaveBeenNthCalledWith(
        index + 1,
        file.blob,
      );
    });
  });
});
