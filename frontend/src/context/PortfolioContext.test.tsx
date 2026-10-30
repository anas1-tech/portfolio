import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api/endpoints";
import { AuthContext } from "@/context/AuthContext";
import { EMPTY_PORTFOLIO, FALLBACK_PORTFOLIO, PortfolioProvider, usePortfolio } from "./PortfolioContext";

vi.mock("@/api/endpoints", () => ({ api: { portfolio: vi.fn() } }));
const portfolio = vi.mocked(api.portfolio);

function Probe() {
  const { data, status } = usePortfolio();
  return (
    <p>
      {status}: {data.settings.hero_title_en || "(empty)"}
    </p>
  );
}

const renderAs = (isAdmin: boolean) =>
  render(
    <AuthContext.Provider value={{ isAdmin, login: vi.fn(), logout: vi.fn() }}>
      <PortfolioProvider>
        <Probe />
      </PortfolioProvider>
    </AuthContext.Provider>,
  );

describe("<PortfolioProvider />", () => {
  beforeEach(() => {
    portfolio.mockReset();
  });

  it("shows the built-in content immediately, before the API answers", () => {
    portfolio.mockReturnValue(new Promise(() => undefined));
    renderAs(false);
    expect(screen.getByText(`loading: ${FALLBACK_PORTFOLIO.settings.hero_title_en}`)).toBeInTheDocument();
  });

  it("switches to the live content once it arrives", async () => {
    portfolio.mockResolvedValue({ ...EMPTY_PORTFOLIO, settings: { ...EMPTY_PORTFOLIO.settings, hero_title_en: "Live name" } });
    renderAs(false);
    expect(await screen.findByText("ready: Live name")).toBeInTheDocument();
  });

  it("keeps the built-in content for visitors when the API is down", async () => {
    portfolio.mockRejectedValue(new Error("down"));
    renderAs(false);
    await waitFor(() => expect(screen.getByText(/^error:/)).toBeInTheDocument());
    expect(screen.getByText(`error: ${FALLBACK_PORTFOLIO.settings.hero_title_en}`)).toBeInTheDocument();
  });

  it("keeps the built-in content for visitors when the database is still empty", async () => {
    portfolio.mockResolvedValue(EMPTY_PORTFOLIO);
    renderAs(false);
    expect(await screen.findByText(`ready: ${FALLBACK_PORTFOLIO.settings.hero_title_en}`)).toBeInTheDocument();
  });

  it("shows the admin the real (empty) database, never the built-in copy", async () => {
    portfolio.mockResolvedValue(EMPTY_PORTFOLIO);
    renderAs(true);
    expect(await screen.findByText("ready: (empty)")).toBeInTheDocument();
  });
});
