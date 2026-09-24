import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api/endpoints";
import { renderWithProviders } from "@/test/utils";
import type { SystemInfo } from "@/types/api";
import SystemModal from "./SystemModal";

vi.mock("@/api/endpoints", () => ({ api: { system: vi.fn() } }));

const info = (overrides: Partial<SystemInfo["database"]> = {}, adminer: string | null = "http://localhost:8081/?pgsql=db"): SystemInfo => ({
  links: [
    { key: "site", url: "http://localhost:8080/" },
    { key: "api", url: "http://localhost:8080/api/portfolio/" },
    { key: "admin", url: "http://localhost:8080/admin/" },
    { key: "adminer", url: adminer },
  ],
  database: {
    engine: "PostgreSQL", host: "db", port: "5432", name: "portfolio", user: "portfolio", ok: true,
    counts: { projects: 4, skills: 5, courses: 3, experiences: 3, messages: 2, unread_messages: 1 },
    ...overrides,
  },
});

beforeEach(() => {
  vi.mocked(api.system).mockReset();
});

describe("<SystemModal />", () => {
  it("shows the service links and database details", async () => {
    vi.mocked(api.system).mockResolvedValue(info());
    renderWithProviders(<SystemModal onClose={() => undefined} />);

    expect(await screen.findByText("http://localhost:8080/admin/")).toBeInTheDocument();
    expect(screen.getByText("http://localhost:8081/?pgsql=db")).toBeInTheDocument();
    expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
    expect(screen.getByText("Connected")).toBeInTheDocument();
  });

  it("never renders a password", async () => {
    vi.mocked(api.system).mockResolvedValue(info());
    renderWithProviders(<SystemModal onClose={() => undefined} />);
    await screen.findByText("PostgreSQL");
    expect(screen.queryByText(/^password$/i)).not.toBeInTheDocument();
    expect(screen.getByText(/never shown here/i)).toBeInTheDocument();
  });

  it("explains how to start Adminer when it is not running", async () => {
    vi.mocked(api.system).mockResolvedValue(info({}, null));
    renderWithProviders(<SystemModal onClose={() => undefined} />);
    expect(await screen.findByText(/docker compose --profile tools up -d/)).toBeInTheDocument();
  });

  it("flags an unreachable database", async () => {
    vi.mocked(api.system).mockResolvedValue(info({ ok: false }));
    renderWithProviders(<SystemModal onClose={() => undefined} />);
    expect(await screen.findByText("Unreachable")).toBeInTheDocument();
  });

  it("shows an error when the request fails", async () => {
    vi.mocked(api.system).mockRejectedValue(new Error("403"));
    renderWithProviders(<SystemModal onClose={() => undefined} />);
    expect(await screen.findByText("Could not load system info.")).toBeInTheDocument();
  });
});
