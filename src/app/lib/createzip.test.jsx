import { describe, it, expect, vi, beforeEach } from "vitest";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import createZIP from "./createzip";

// Mock the saveAs function
vi.mock("file-saver", () => ({
  saveAs: vi.fn(),
}));

describe("createZIP", () => {
  let files;
  beforeEach(() => {
    files = [
      {
        text: "file1.txt",
        blob: new Blob(["content1"], { type: "text/plain" }),
      },
      {
        text: "file2.txt",
        blob: new Blob(["content2"], { type: "text/plain" }),
      },
    ];
  });

  it("should create a zip file and call saveAs", async () => {
    const spy = vi.spyOn(JSZip.prototype, "file");
    // Call the createZIP function
    await createZIP(files);

    // Check that saveAs was called
    expect(saveAs).toHaveBeenCalled();
    // Check that saveAs was called with the correct filename
    expect(saveAs.mock.calls[0][1]).toBe("converted-files.zip");
    expect(spy).toBeCalledTimes(files.length);
  });
});

// TODO: Проверить плохой сценарий
