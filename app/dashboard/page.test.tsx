import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest"; // Use 'jest' if using Jest
import DashboardPage from "./page";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

// Mock dependencies
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
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

    await DashboardPage();

    expect(redirect).toHaveBeenCalledWith("/api/auth/signin");
    expect(redirect).toHaveBeenCalledTimes(1);
  });

  it("renders user name and user ID when authenticated", async () => {
    const mockUser = { id: "usr_12345", name: "Alex Smith" };
    mockedAuth.mockResolvedValue({
      user: mockUser,
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
