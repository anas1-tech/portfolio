import { ExportOutlined } from "@ant-design/icons";
import { Alert, Button, Descriptions, Modal, Spin, Statistic, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/api/endpoints";
import type { SystemInfo } from "@/types/api";

interface SystemModalProps {
  onClose: () => void;
}

/** Admin-only overview: where each service lives and how the database is wired (never the password). */
export default function SystemModal({ onClose }: SystemModalProps) {
  const { t } = useTranslation();
  const [info, setInfo] = useState<SystemInfo | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api.system().then(setInfo).catch(() => setFailed(true));
  }, []);

  const db = info?.database;

  return (
    <Modal open title={t("system.title")} footer={null} width={720} onCancel={onClose}>
      {failed && <Alert type="error" showIcon message={t("system.loadFailed")} />}
      {!info && !failed && (
        <div className="grid place-items-center py-10">
          <Spin />
        </div>
      )}

      {info && db && (
        <div className="grid gap-6">
          <Descriptions
            bordered
            size="small"
            column={1}
            title={t("system.links")}
            items={info.links.map(({ key, url }) => ({
              key,
              label: t(`system.${key}`),
              children: (
                <div className="flex items-center justify-between gap-2">
                  {/* antd Typography forces the page direction, so isolate the URL with <bdi> to keep it left-to-right */}
                  <Typography.Text code copyable={{ text: url }} className="break-all">
                    <bdi dir="ltr">{url}</bdi>
                  </Typography.Text>
                  <Button size="small" shape="circle" icon={<ExportOutlined />} href={url} target="_blank" aria-label={t("system.open")} />
                </div>
              ),
            }))}
          />

          <div>
            <Descriptions
              bordered
              size="small"
              column={1}
              title={t("system.database")}
              items={[
                {
                  key: "status",
                  label: t("system.status"),
                  children: <Tag color={db.ok ? "success" : "error"}>{db.ok ? t("system.connected") : t("system.down")}</Tag>,
                },
                ...([["engine", db.engine]] as const)
                  .filter(([, value]) => value)
                  .map(([key, value]) => ({
                    key,
                    label: t(`system.${key}`),
                    children: (
                      <Typography.Text copyable={{ text: String(value) }}>
                        <bdi dir="ltr">{value}</bdi>
                      </Typography.Text>
                    ),
                  })),
              ]}
            />
            <Typography.Paragraph type="secondary" className="!mt-2 !mb-0 text-xs">
              {t("system.passwordNote")}
            </Typography.Paragraph>
          </div>

          <div>
            <Typography.Title level={5}>{t("system.content")}</Typography.Title>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {(["projects", "skills", "courses", "experiences"] as const).map((k) => (
                <Statistic key={k} title={t(`system.${k}`)} value={db.counts[k]} />
              ))}
              <Statistic
                title={`${t("system.messages")} (${db.counts.unread_messages} ${t("system.unread")})`}
                value={db.counts.messages}
              />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
