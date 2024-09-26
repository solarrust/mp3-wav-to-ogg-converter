import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import DownloadLinksList from "./DownloadLinksList";

describe("DownloadLinksList Component", () => {
  let files;

  beforeEach(() => {
    files = [
      {
        text: "File 1",
        download: "file1.ogg",
        href: "https://example.com/",
      },
      {
        text: "File 2",
        download: "file2.ogg",
        href: "https://example.com/",
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
      expect(linkElement).toHaveAttribute("href", file.href);
    });
  });
});
