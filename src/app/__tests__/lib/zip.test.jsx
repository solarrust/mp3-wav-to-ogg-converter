import { describe, it, expect, vi } from "vitest";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import createZIP from "../../lib/zip";

// Mock the saveAs function
vi.mock("file-saver", () => ({
  saveAs: vi.fn(),
}));

describe("createZIP", () => {
  it("should create a zip file and call saveAs", async () => {
    const files = [
      {
        text: "file1.txt",
        blob: new Blob(["content1"], { type: "text/plain" }),
      },
      {
        text: "file2.txt",
        blob: new Blob(["content2"], { type: "text/plain" }),
      },
    ];

    // Call the createZIP function
    await createZIP(files);

    // Check that saveAs was called
    expect(saveAs).toHaveBeenCalled();
    // Check that saveAs was called with the correct filename
    expect(saveAs.mock.calls[0][1]).toBe("converted-files.zip");
  });

  it("should add files to the zip", async () => {
    const files = [
      {
        text: "file1.txt",
        blob: new Blob(["content1"], { type: "text/plain" }),
      },
      {
        text: "file2.txt",
        blob: new Blob(["content2"], { type: "text/plain" }),
      },
    ];

    // Create a new JSZip instance and add files to it
    const zip = new JSZip();
    files.forEach((file) => zip.file(file.text, file.blob));
    // Generate the expected blob
    const expectedBlob = await zip.generateAsync({ type: "blob" });

    // Call the createZIP function
    await createZIP(files);

    // Check that saveAs was called with the correct blob
    expect(saveAs.mock.calls[0][0]).toEqual(expectedBlob);
  });
});
