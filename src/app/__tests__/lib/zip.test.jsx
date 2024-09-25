import { describe, it, expect, vi } from "vitest";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import createZIP from "../../lib/zip";

// Мокаем saveAs функцию
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

    await createZIP(files);

    // Проверяем, что saveAs был вызван
    expect(saveAs).toHaveBeenCalled();
    // Проверяем, что saveAs был вызван с blob и именем файла
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

    const zip = new JSZip();
    files.forEach((file) => zip.file(file.text, file.blob));
    const expectedBlob = await zip.generateAsync({ type: "blob" });

    await createZIP(files);

    // Проверяем, что saveAs был вызван с правильным blob
    expect(saveAs.mock.calls[0][0]).toEqual(expectedBlob);
  });
});
