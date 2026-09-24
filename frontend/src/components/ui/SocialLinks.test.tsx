import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { settingsFixture } from "@/test/fixtures";
import SocialLinks from "./SocialLinks";

describe("<SocialLinks />", () => {
  it("renders nothing for settings that are empty", () => {
    render(<SocialLinks settings={settingsFixture} />);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("renders only the links that are filled in", () => {
    render(<SocialLinks settings={{ ...settingsFixture, github: "https://github.com/anas", email: "a@b.co" }} />);
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/anas");
    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute("href", "mailto:a@b.co");
  });

  it("builds a wa.me link from the WhatsApp number", () => {
    render(<SocialLinks settings={{ ...settingsFixture, whatsapp: "966500000000" }} />);
    expect(screen.getByRole("link", { name: "WhatsApp" })).toHaveAttribute("href", "https://wa.me/966500000000");
  });

  it("opens external links in a new tab safely", () => {
    render(<SocialLinks settings={{ ...settingsFixture, linkedin: "https://linkedin.com/in/x" }} />);
    const link = screen.getByRole("link", { name: "LinkedIn" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noreferrer"));
  });
});
