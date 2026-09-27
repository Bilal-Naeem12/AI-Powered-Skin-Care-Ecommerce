import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import CategoryImage from "../src/component/UI/CategoryImage";

afterEach(cleanup);

it("replaces a broken remote image and retries a newly supplied URL", () => {
  const { rerender } = render(<CategoryImage name="Cleanser" src="https://example.com/broken.jpg" />);
  fireEvent.error(screen.getByRole("img"));
  expect(screen.getByRole("img").getAttribute("src")).toBe("/assets/product_images/cleanser.png");
  rerender(<CategoryImage name="Cleanser" src="https://example.com/new.jpg" />);
  expect(screen.getByRole("img").getAttribute("src")).toBe("https://example.com/new.jpg");
});

it("handles missing images and stops retrying if the local fallback fails", () => {
  render(<CategoryImage name="Unknown category" />);
  expect(screen.getByRole("img").getAttribute("src")).toBe("/assets/product_images/other.webp");
  fireEvent.error(screen.getByRole("img"));
  expect(screen.getByRole("img").tagName).toBe("SPAN");
  expect(screen.getByRole("img").textContent).toBe("U");
});
