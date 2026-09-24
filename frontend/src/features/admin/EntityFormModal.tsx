import { UploadOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Modal, Select, Upload } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/api/client";
import { api } from "@/api/endpoints";
import { usePortfolio } from "@/context/PortfolioContext";
import { buildPayload, type FormValues } from "@/lib/payload";
import type { EntityItem, SiteSettings } from "@/types/api";
import { schemas, type Field } from "./schemas";

type Source = SiteSettings | EntityItem | null;

/** Starting value for one field: existing data when editing, sensible defaults when adding. */
function initialValue(field: Field, source: Source): string | string[] | undefined {
  const raw = (source as Record<string, unknown> | null)?.[field.name];
  if (field.type === "tags") return Array.isArray(raw) ? (raw as string[]) : [];
  if (field.type === "file") return undefined;
  if (typeof raw === "string") return raw;
  return field.type === "select" ? field.options?.[0]?.value : "";
}

/** One modal that edits any entity described in schemas.ts. Mount it only while `editor` is set. */
export default function EntityFormModal() {
  const { editor, closeEditor, data, reload } = usePortfolio();
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  if (!editor) return null;
  const schema = schemas[editor.kind];
  const source: Source = schema.single ? data.settings : editor.item;

  const initialValues = Object.fromEntries(schema.fields.map((f) => [f.name, initialValue(f, source)]));

  // Runs only for valid data: the OK button calls form.submit(), and antd calls onFinish after validation.
  const save = async (values: FormValues) => {
    const body = buildPayload(values, file);
    setSaving(true);
    try {
      if (schema.single) await api.updateSettings(body);
      else if (editor.item) await api.update(schema.endpoint, editor.item.id, body);
      else await api.create(schema.endpoint, body);
      message.success(t("admin.saved"));
      await reload();
      closeEditor();
    } catch (error) {
      message.error(getErrorMessage(error));
      setSaving(false);
    }
  };

  const label = (f: Field) => (f.lang ? `${t(`admin.fields.${f.labelKey}`)} · ${f.lang.toUpperCase()}` : t(`admin.fields.${f.labelKey}`));
  const dir = (f: Field) => (f.ltr || f.lang === "en" ? "ltr" : f.lang === "ar" ? "rtl" : undefined);

  const control = (f: Field) => {
    switch (f.type) {
      case "textarea":
        return <Input.TextArea rows={3} dir={dir(f)} />;
      case "select":
        return <Select options={f.options?.map((o) => ({ value: o.value, label: t(`admin.fields.${o.labelKey}`) }))} />;
      case "tags":
        return <Select mode="tags" tokenSeparators={[","]} open={false} suffixIcon={null} />;
      case "file":
        return (
          <Upload
            accept="image/*"
            maxCount={1}
            listType="picture"
            beforeUpload={(f) => {
              setFile(f);
              return false; // keep the file local; it is sent with the form
            }}
            onRemove={() => setFile(null)}
          >
            <Button icon={<UploadOutlined />}>{t("admin.pickImage")}</Button>
          </Upload>
        );
      default:
        return <Input type={f.type === "email" ? "email" : "text"} dir={dir(f)} />;
    }
  };

  return (
    <Modal
      open
      title={t(`admin.entities.${editor.kind}`)}
      width={schema.fields.length > 6 ? 760 : 520}
      okText={t("common.save")}
      cancelText={t("common.cancel")}
      confirmLoading={saving}
      onOk={() => form.submit()}
      onCancel={closeEditor}
      maskClosable={false}
    >
      <Form form={form} layout="vertical" initialValues={initialValues} onFinish={save} className="grid gap-x-4 sm:grid-cols-2">
        {schema.fields.map((f) => (
          <Form.Item
            key={f.name}
            name={f.type === "file" ? undefined : f.name}
            label={label(f)}
            rules={f.required ? [{ required: true, message: t("contact.required") }] : undefined}
            className={f.type === "textarea" || f.type === "file" || f.type === "tags" ? "sm:col-span-2" : ""}
          >
            {control(f)}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
}
