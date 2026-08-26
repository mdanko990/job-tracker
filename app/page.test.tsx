import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HomePage from "./page";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
  signIn: vi.fn(),
}));

// Cast mocked auth to bypass NextAuth middleware overload (Fixes Errors 1 & 2)
const mockedAuth = vi.mocked(auth) as unknown as ReturnType<typeof vi.fn>;

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders landing page and login button when user is unauthenticated", async () => {
    mockedAuth.mockResolvedValue(null);

    const Page = await HomePage();
    render(Page);

    expect(
      screen.getByRole("heading", { name: /job tracker/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /track your job applications and interviews in one place/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in with google/i }),
    ).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects to /dashboard when user is already logged in", async () => {
    mockedAuth.mockResolvedValue({
      user: { id: "user-1", name: "Jane Doe", email: "jane@example.com" },
      expires: "2026-01-01",
    });

    await HomePage();

    expect(redirect).toHaveBeenCalledWith("/dashboard");
    expect(redirect).toHaveBeenCalledTimes(1);
  });
});
