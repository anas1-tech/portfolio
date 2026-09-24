import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { projectsFixture } from "@/test/fixtures";
import { renderWithProviders } from "@/test/utils";
import Projects from "./Projects";

const titles = () => screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);

describe("<Projects />", () => {
  it("lists every project with its localized title", () => {
    renderWithProviders(<Projects />, { portfolio: { projects: projectsFixture } });
    expect(titles()).toEqual(["Project 1", "Project 2", "Project 3"]);
  });

  it("filters by technology and resets with All", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Projects />, { portfolio: { projects: projectsFixture } });
    const filters = screen.getByRole("group");

    await user.click(within(filters).getByText("React"));
    expect(titles()).toEqual(["Project 1", "Project 2"]);

    await user.click(within(filters).getByText("Python"));
    expect(titles()).toEqual(["Project 3"]);

    await user.click(within(filters).getByText("All"));
    expect(titles()).toHaveLength(3);
  });

  it("clicking the active technology again clears the filter", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Projects />, { portfolio: { projects: projectsFixture } });
    const filters = screen.getByRole("group");

    await user.click(within(filters).getByText("Python"));
    expect(titles()).toHaveLength(1);
    await user.click(within(filters).getByText("Python"));
    expect(titles()).toHaveLength(3);
  });

  it("shows a neutral placeholder (not another project's image) when there is no picture", () => {
    renderWithProviders(<Projects />, { portfolio: { projects: projectsFixture } });
    expect(screen.getAllByTestId("project-placeholder")).toHaveLength(2); // projects 2 and 3 have no image
    expect(document.querySelectorAll("img")).toHaveLength(1);
  });

  it("renders live and code links only when they exist", () => {
    renderWithProviders(<Projects />, { portfolio: { projects: projectsFixture } });
    expect(screen.getByRole("link", { name: /Live/ })).toHaveAttribute("href", "https://demo.example.com");
    expect(screen.getByRole("link", { name: /Code/ })).toHaveAttribute("href", "https://github.com/x/y");
    expect(screen.getAllByRole("link", { name: /Live/ })).toHaveLength(1);
  });

  it("shows the empty state, without filters, when there are no projects", () => {
    renderWithProviders(<Projects />, { portfolio: { projects: [] } });
    expect(screen.getByText("No projects yet.")).toBeInTheDocument();
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("hides admin controls from visitors", () => {
    renderWithProviders(<Projects />, { portfolio: { projects: projectsFixture } });
    expect(screen.queryByRole("button", { name: "Add" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit" })).not.toBeInTheDocument();
  });

  it("shows add / edit / delete controls to the admin", () => {
    renderWithProviders(<Projects />, { portfolio: { projects: projectsFixture }, isAdmin: true });
    expect(screen.getByRole("button", { name: /Add/ })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Edit" })).toHaveLength(3);
    expect(screen.getAllByRole("button", { name: "Delete" })).toHaveLength(3);
  });
});
