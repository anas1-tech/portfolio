import { useId, useState, type FormEvent, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/api/endpoints";
import type { ContactPayload } from "@/types/api";

type Status = "idle" | "sent" | "error";
type Field = "name" | "email" | "message";

const EMPTY: ContactPayload = { name: "", email: "", message: "", website: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const { t } = useTranslation();
  const id = useId();
  const [values, setValues] = useState<ContactPayload>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const validate = (v: ContactPayload) => {
    const next: Partial<Record<Field, string>> = {};
    for (const f of ["name", "email", "message"] as const) if (!v[f].trim()) next[f] = t("contact.required");
    if (!next.email && !EMAIL_RE.test(v.email.trim())) next.email = t("contact.invalidEmail");
    return next;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      e.currentTarget.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    setSending(true);
    setStatus("idle");
    try {
      await api.contact(values);
      setValues(EMPTY);
      setStatus("sent");
    } catch {
      setStatus("error");
    } finally {
      setSending(false);
    }
  };

  const set = (f: keyof ContactPayload) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [f]: e.target.value }));
    if (f in errors) setErrors((old) => ({ ...old, [f]: undefined }));
  };

  const input = "w-full rounded-2xl border-2 border-transparent bg-bg2 px-5 py-3 text-fg outline-none transition-colors focus:border-accent aria-[invalid=true]:border-danger";

  const field = (f: Field, label: string, control: (props: object) => ReactNode) => {
    const err = errors[f];
    return (
      <div className="grid gap-2">
        <label htmlFor={`${id}-${f}`} className="font-bold">
          {label}
        </label>
        {control({
          id: `${id}-${f}`,
          name: f,
          value: values[f],
          onChange: set(f),
          className: input,
          "aria-invalid": err ? true : undefined,
          "aria-describedby": err ? `${id}-${f}-err` : undefined,
        })}
        {err && (
          <p id={`${id}-${f}-err`} className="text-sm font-medium text-danger">
            {err}
          </p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-6 rounded-block bg-bg p-6 text-fg md:p-10" aria-label={t("nav.contact")}>
      {field("name", t("contact.name"), (p) => <input {...p} maxLength={100} autoComplete="name" />)}
      {field("email", t("contact.emailField"), (p) => <input {...p} type="email" dir="ltr" autoComplete="email" />)}
      {field("message", t("contact.message"), (p) => <textarea {...p} rows={5} maxLength={3000} />)}

      {/* Honeypot: hidden from people, irresistible to bots. The backend drops anything that fills it. */}
      <div className="absolute -start-[9999px] size-px overflow-hidden" aria-hidden="true">
        <input name="website" tabIndex={-1} autoComplete="off" value={values.website ?? ""} onChange={set("website")} />
      </div>

      <button type="submit" disabled={sending} className="btn btn-primary w-full text-lg disabled:opacity-70">
        {sending ? t("contact.sending") : t("contact.send")}
      </button>

      <div aria-live="polite">
        {status === "sent" && <p className="font-bold text-ok">{t("contact.sent")}</p>}
        {status === "error" && <p className="font-bold text-danger">{t("contact.failed")}</p>}
      </div>
    </form>
  );
}
