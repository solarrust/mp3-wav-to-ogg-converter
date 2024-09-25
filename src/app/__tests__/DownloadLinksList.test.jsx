import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import DownloadLinksList from "../components/DownloadLinksList";

vi.mock("../components/DownloadLink", () => ({
  __esModule: true,
  default: ({ href, text, download }) => (
    <a href={href} download={download}>
      {text}
    </a>
  ),
}));

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
        blob: new Uint8Array([0x01, 0x02, 0x03]),
        text: "File 1",
        download: "file1.ogg",
      },
      {
        blob: new Uint8Array([0x04, 0x05, 0x06]),
        text: "File 2",
        download: "file2.ogg",
      },
    ];
  });

  it("renders a list of download links", () => {
    render(<DownloadLinksList files={files} />);

    // Verify that the correct number of list items are rendered
    const listItems = screen.getAllByRole("listitem");
    expect(listItems.length).toBe(2);

    // Verify that the download links are correctly rendered
    expect(screen.getByText("File 1")).toBeInTheDocument();
    expect(screen.getByText("File 2")).toBeInTheDocument();
  });

  it("creates correct blob URLs for each file", () => {
    const createObjectURLMock = vi
      .spyOn(URL, "createObjectURL")
      .mockImplementation((blob) => `blob:${blob.size}`);

    render(<DownloadLinksList files={files} />);

    // Ensure that URLs are generated correctly
    expect(createObjectURLMock).toHaveBeenCalledTimes(2);

    // Verify that the correct URL is created for each file
    expect(createObjectURLMock).toHaveBeenCalledWith(expect.any(Blob));
  });

  it("assigns the correct download attributes", () => {
    render(<DownloadLinksList files={files} />);

    // Verify that the links have the correct download attribute
    const link1 = screen.getByText("File 1");
    const link2 = screen.getByText("File 2");

    expect(link1).toHaveAttribute("download", "file1.ogg");
    expect(link2).toHaveAttribute("download", "file2.ogg");
  });
});
