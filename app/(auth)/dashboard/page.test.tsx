import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DashboardPage from "./page";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT: ${url}`);
  }),
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

const mockedAuth = vi.mocked(auth) as unknown as ReturnType<typeof vi.fn>;

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to signin page when user is not logged in", async () => {
    mockedAuth.mockResolvedValue(null);

    await expect(DashboardPage()).rejects.toThrow("NEXT_REDIRECT");
    expect(redirect).toHaveBeenCalledWith("/api/auth/signin");
  });

  it("renders user name and user ID when authenticated", async () => {
    mockedAuth.mockResolvedValue({
      user: { id: "usr_12345", name: "Alex Smith" },
      expires: "2026-01-01",
    });

    const Page = await DashboardPage();
    render(Page);

    expect(
      screen.getByRole("heading", { name: /welcome back, alex smith/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/user id: usr_12345/i)).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });
});
