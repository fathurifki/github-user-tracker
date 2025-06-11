import { render, screen } from "@testing-library/react";
import SearchResult from "@/components/ui/search-result";
import { describe, it, expect, vi } from "vitest";

describe("SearchResult", () => {
  it("renders the search result", () => {
    render(
      <SearchResult
        name="Test User"
        role="Developer"
        imageUrl="/placeholder.svg"
        onClick={vi.fn()}
      />
    );
    expect(screen.getByText("Test User")).toBeTruthy();
    expect(screen.getByText("Developer")).toBeTruthy();
  });
});
