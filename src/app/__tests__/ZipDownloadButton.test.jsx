import React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import ZipDownloadLink from "../components/ZipDownloadButton";

afterEach(() => {
  cleanup();
});

vi.mock("jszip", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      file: vi.fn(),
      generateAsync: vi.fn().mockResolvedValue(new Blob()),
    })),
  };
});

vi.mock("file-saver", () => ({
  saveAs: vi.fn(),
}));

describe("ZipDownloadLink Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing when files are provided", () => {
    const files = [{ text: "file1.txt", blob: new Blob(["content"]) }];
    const { getByText } = render(<ZipDownloadLink files={files} />);

    expect(getByText("Download ZIP")).toBeInTheDocument();
  });

  it("does not render button when no files are provided", () => {
    const { queryByText } = render(<ZipDownloadLink files={[]} />);

    expect(queryByText("Download ZIP")).toBeNull();
  });

  it("calls JSZip and saveAs correctly when button is clicked", async () => {
    const files = [{ text: "file1.txt", blob: new Blob(["content"]) }];
    const { getByText } = render(<ZipDownloadLink files={files} />);

    const button = getByText("Download ZIP");

    fireEvent.click(button);

    expect(JSZip).toHaveBeenCalled();
    const zipInstance = JSZip.mock.results[0].value;
    expect(zipInstance.file).toHaveBeenCalledWith("file1.txt", files[0].blob);

    await zipInstance.generateAsync();
    expect(zipInstance.generateAsync).toHaveBeenCalledWith({ type: "blob" });
    expect(saveAs).toHaveBeenCalledWith(
      expect.any(Blob),
      "converted-files.zip",
    );
  });
});
