import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ZipDownloadButton from "./ZipDownloadButton";
import createZIP from "../../lib/createzip";

afterEach(() => {
  cleanup();
});

vi.mock("../../lib/createzip");

describe("ZipDownloadLink Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls createZIP and saves the file when button is clicked", async () => {
    const files = [{ text: "file1.txt", blob: new Blob(["content"]) }];
    createZIP.mockResolvedValueOnce();

    render(<ZipDownloadButton files={files} />);

    const button = screen.getByText("Download ZIP");
    fireEvent.click(button);

    await waitFor(() => {
      expect(createZIP).toHaveBeenCalledWith(files);
    });
  });

  it("shows error if createZIP fails", async () => {
    const files = [{ text: "file1.txt", blob: new Blob(["content"]) }];
    const error = new Error("Failed to create ZIP");
    createZIP.mockRejectedValueOnce(error);

    render(<ZipDownloadButton files={files} />);

    const button = screen.getByText("Download ZIP");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(error.message)).toBeInTheDocument();
    });
  });
});
