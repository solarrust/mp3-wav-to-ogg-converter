import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ConvertButton from "./ConvertButton";

describe("ConvertButton Component", () => {
  it("calls onClick function when clicked", () => {
    const handleClick = vi.fn();
    const { getByText } = render(<ConvertButton onClick={handleClick} />);

    const button = getByText("Convert into OGG");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
