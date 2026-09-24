import { SendOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/api/endpoints";
import type { ContactPayload } from "@/types/api";

type Status = "idle" | "sent" | "error";

export default function ContactForm() {
  const { t } = useTranslation();
  const [form] = Form.useForm<ContactPayload>();
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const onFinish = async (values: ContactPayload) => {
    setSending(true);
    setStatus("idle");
    try {
      await api.contact(values);
      form.resetFields();
      setStatus("sent");
    } catch {
      setStatus("error");
    } finally {
      setSending(false);
    }
  };

  const required = { required: true, message: t("contact.required") };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} className="card p-6 md:p-8" aria-label={t("nav.contact")}>
      <Form.Item name="name" label={t("contact.name")} rules={[required]}>
        <Input maxLength={100} autoComplete="name" />
      </Form.Item>
      <Form.Item name="email" label={t("contact.emailField")} rules={[required, { type: "email", message: t("contact.invalidEmail") }]}>
        <Input dir="ltr" autoComplete="email" />
      </Form.Item>
      <Form.Item name="message" label={t("contact.message")} rules={[required]}>
        <Input.TextArea rows={5} maxLength={3000} showCount />
      </Form.Item>

      {/* Honeypot: hidden from people, irresistible to bots. The backend drops anything that fills it. */}
      <Form.Item name="website" className="absolute -start-[9999px] size-px overflow-hidden opacity-0" aria-hidden="true">
        <Input tabIndex={-1} autoComplete="off" />
      </Form.Item>

      <Button type="primary" htmlType="submit" size="large" shape="round" block icon={<SendOutlined />} loading={sending} className="grad-bg border-0">
        {t("contact.send")}
      </Button>

      {status === "sent" && <Alert className="!mt-4" type="success" showIcon message={t("contact.sent")} />}
      {status === "error" && <Alert className="!mt-4" type="error" showIcon message={t("contact.failed")} />}
    </Form>
  );
}
