import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api/endpoints";
import { projectsFixture } from "@/test/fixtures";
import { renderWithProviders } from "@/test/utils";
import EntityFormModal from "./EntityFormModal";
import { ItemControls } from "./ItemControls";

vi.mock("@/api/endpoints", () => ({
  api: { create: vi.fn(), update: vi.fn(), updateSettings: vi.fn(), remove: vi.fn() },
}));

beforeEach(() => vi.clearAllMocks());

describe("<ItemControls />", () => {
  it("renders nothing for visitors", () => {
    renderWithProviders(<ItemControls kind="project" item={projectsFixture[0]!} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("asks for confirmation, then deletes and reloads", async () => {
    const user = userEvent.setup();
    vi.mocked(api.remove).mockResolvedValue({} as never);
    const { portfolio } = renderWithProviders(<ItemControls kind="project" item={projectsFixture[0]!} />, { isAdmin: true });

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(api.remove).not.toHaveBeenCalled(); // nothing happens until confirmed

    await user.click(await screen.findByRole("button", { name: "Yes" }));

    await waitFor(() => expect(api.remove).toHaveBeenCalledWith("projects", 1));
    await waitFor(() => expect(portfolio.reload).toHaveBeenCalled());
  });

  it("opens the editor for that item", async () => {
    const user = userEvent.setup();
    const { portfolio } = renderWithProviders(<ItemControls kind="project" item={projectsFixture[1]!} />, { isAdmin: true });
    await user.click(screen.getByRole("button", { name: "Edit" }));
    expect(portfolio.openEditor).toHaveBeenCalledWith("project", projectsFixture[1]);
  });
});

describe("<EntityFormModal />", () => {
  it("creates a skill from the generic form", async () => {
    const user = userEvent.setup();
    vi.mocked(api.create).mockResolvedValue({} as never);
    const { portfolio } = renderWithProviders(<EntityFormModal />, { isAdmin: true, editor: { kind: "skill", item: null } });

    await user.type(screen.getByLabelText("Skill · AR"), "قيادة");
    await user.type(screen.getByLabelText("Skill · EN"), "Leadership");
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(api.create).toHaveBeenCalledWith("skills", { name_ar: "قيادة", name_en: "Leadership" }));
    await waitFor(() => expect(portfolio.closeEditor).toHaveBeenCalled());
  });

  it("requires the Arabic name and does not call the API without it", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EntityFormModal />, { isAdmin: true, editor: { kind: "skill", item: null } });

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("This field is required")).toBeInTheDocument();
    expect(api.create).not.toHaveBeenCalled();
  });

  it("updates an existing project with the values it started from", async () => {
    const user = userEvent.setup();
    vi.mocked(api.update).mockResolvedValue({} as never);
    renderWithProviders(<EntityFormModal />, { isAdmin: true, editor: { kind: "project", item: projectsFixture[0]! } });

    expect(screen.getByLabelText("Title · EN")).toHaveValue("Project 1");
    await user.clear(screen.getByLabelText("Title · EN"));
    await user.type(screen.getByLabelText("Title · EN"), "Renamed");
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(api.update).toHaveBeenCalledOnce());
    const [endpoint, id, body] = vi.mocked(api.update).mock.calls[0]!;
    expect(endpoint).toBe("projects");
    expect(id).toBe(1);
    expect(body).toMatchObject({ title_en: "Renamed", title_ar: "مشروع 1", techs: ["React", "Django"] });
  });
});
