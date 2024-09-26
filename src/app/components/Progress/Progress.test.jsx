import React from "react";
import { cleanup, render } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import Progress from "./Progress";

afterEach(() => {
  cleanup();
});

describe("Progress Component", () => {
  it("renders LinearProgress with correct value", () => {
    const { getByRole } = render(<Progress value={0.5} />);
    const progressBar = getByRole("progressbar");
    const valueNowAttr = progressBar.getAttribute("aria-valuenow");

    expect(valueNowAttr).toEqual("50");
  });

  it("renders LinearProgress with value of 0", () => {
    const { getByRole } = render(<Progress value={0} />);
    const progressBar = getByRole("progressbar");
    const valueNowAttr = progressBar.getAttribute("aria-valuenow");

    expect(valueNowAttr).toEqual("0");
  });

  it("renders LinearProgress with value of 1", () => {
    const { getByRole } = render(<Progress value={1} />);
    const progressBar = getByRole("progressbar");
    const valueNowAttr = progressBar.getAttribute("aria-valuenow");

    expect(valueNowAttr).toEqual("100");
  });
});
