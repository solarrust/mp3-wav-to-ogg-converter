import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import App from "./App";
import loadWasm from "../../lib/loadWasm";

afterEach(() => {
  cleanup();
});

vi.mock("../../lib/loadWasm", () => ({
  default: vi.fn(),
}));

vi.mock("../Converter/Converter", () => ({
  default: vi.fn(() => <div>Converter Component</div>),
}));

describe("App Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads ffmpeg successfully", async () => {
    const mockFfmpeg = { load: vi.fn(), on: vi.fn() };
    loadWasm.mockResolvedValueOnce(mockFfmpeg);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Converter Component")).toBeInTheDocument();
    });

    expect(loadWasm).toHaveBeenCalledTimes(1);
  });

  it("handles error during ffmpeg loading", async () => {
    const errorMessage = "Failed to load";
    loadWasm.mockRejectedValueOnce(new Error(errorMessage));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(loadWasm).toHaveBeenCalledTimes(1);
  });
});
