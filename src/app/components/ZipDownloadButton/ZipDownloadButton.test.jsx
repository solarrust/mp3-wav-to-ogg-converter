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
});
