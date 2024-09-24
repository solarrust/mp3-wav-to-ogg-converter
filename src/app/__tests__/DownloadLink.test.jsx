import React from "react";
import { cleanup, render } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import DownloadLink from "../components/DownloadLink";

afterEach(() => {
  cleanup();
});

describe("DownloadLink Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<DownloadLink href="#" text="file" />);
    expect(container).toBeInTheDocument();
  });

  it("displays the correct link text", () => {
    const { getByText } = render(<DownloadLink href="#" text="file" />);
    expect(getByText("Download file")).toBeInTheDocument();
  });

  it("sets the correct href attribute", () => {
    const { getByText } = render(
      <DownloadLink href="http://example.com/file.ogg" text="file" />,
    );
    const link = getByText("Download file");
    expect(link).toHaveAttribute("href", "http://example.com/file.ogg");
  });

  it("sets the correct download attribute", () => {
    const { getByText } = render(
      <DownloadLink
        href="http://example.com/file.ogg"
        download="file.ogg"
        text="file"
      />,
    );
    const link = getByText("Download file");
    expect(link).toHaveAttribute("download", "file.ogg");
  });

  it("does not set the download attribute if not provided", () => {
    const { getByText } = render(
      <DownloadLink href="http://example.com/file.ogg" text="file" />,
    );
    const link = getByText("Download file");
    expect(link).not.toHaveAttribute("download");
  });
});
