import { App, Form, Input, Modal } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { message } = App.useApp();
  const [form] = Form.useForm<{ username: string; password: string }>();
  const [busy, setBusy] = useState(false);

  // Runs only for valid data: the OK button calls form.submit(), and antd calls onFinish after validation.
  const submit = async ({ username, password }: { username: string; password: string }) => {
    setBusy(true);
    try {
      await login(username, password);
      onClose();
    } catch {
      message.error(t("auth.badLogin"));
      setBusy(false);
    }
  };

  return (
    <Modal open title={t("auth.login")} okText={t("auth.signIn")} cancelText={t("common.cancel")} confirmLoading={busy} onOk={() => form.submit()} onCancel={onClose}>
      <Form form={form} layout="vertical" onFinish={submit}>
        <Form.Item name="username" label={t("auth.username")} rules={[{ required: true, message: t("contact.required") }]}>
          <Input autoFocus autoComplete="username" dir="ltr" />
        </Form.Item>
        <Form.Item name="password" label={t("auth.password")} rules={[{ required: true, message: t("contact.required") }]}>
          <Input.Password autoComplete="current-password" dir="ltr" />
        </Form.Item>
        <button type="submit" hidden />
      </Form>
    </Modal>
  );
}
