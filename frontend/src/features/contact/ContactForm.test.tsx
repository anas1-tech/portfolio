import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api/endpoints";
import { renderWithProviders } from "@/test/utils";
import ContactForm from "./ContactForm";

vi.mock("@/api/endpoints", () => ({ api: { contact: vi.fn() } }));
const contact = vi.mocked(api.contact);

async function fillAndSend(overrides: { name?: string; email?: string; message?: string } = {}) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Name"), overrides.name ?? "Sara");
  await user.type(screen.getByLabelText("Email"), overrides.email ?? "sara@example.com");
  await user.type(screen.getByLabelText("Your message"), overrides.message ?? "Hello there");
  await user.click(screen.getByRole("button", { name: /Send/ }));
}

describe("<ContactForm />", () => {
  beforeEach(() => {
    // braces matter: a hook that returns a function makes vitest call it as a teardown
    contact.mockReset();
  });

  it("asks for every required field and does not call the API", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactForm />);

    await user.click(screen.getByRole("button", { name: /Send/ }));

    expect(await screen.findAllByText("This field is required")).toHaveLength(3);
    expect(contact).not.toHaveBeenCalled();
  });

  it("rejects a malformed email address", async () => {
    renderWithProviders(<ContactForm />);
    await fillAndSend({ email: "not-an-email" });

    expect(await screen.findByText("Enter a valid email address")).toBeInTheDocument();
    expect(contact).not.toHaveBeenCalled();
  });

  it("sends the message, confirms, and clears the form", async () => {
    contact.mockResolvedValue({} as never);
    renderWithProviders(<ContactForm />);

    await fillAndSend();

    await waitFor(() => expect(contact).toHaveBeenCalledOnce());
    expect(contact).toHaveBeenCalledWith(expect.objectContaining({ name: "Sara", email: "sara@example.com", message: "Hello there" }));
    expect(await screen.findByText(/Sent, thank you/)).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("");
  });

  it("tells the visitor when sending fails and keeps what they typed", async () => {
    contact.mockRejectedValue(new Error("network"));
    renderWithProviders(<ContactForm />);

    await fillAndSend();

    expect(await screen.findByText(/Couldn't send/)).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("Sara");
  });
});
