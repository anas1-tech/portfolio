import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, Popconfirm } from "antd";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/api/client";
import { api } from "@/api/endpoints";
import { useAuth } from "@/context/AuthContext";
import { usePortfolio } from "@/context/PortfolioContext";
import type { EntityItem, EntityKind } from "@/types/api";
import { schemas } from "./schemas";

type ItemKind = Exclude<EntityKind, "settings">;

/** Edit + delete buttons for one item. Renders nothing for visitors. */
export function ItemControls({ kind, item }: { kind: ItemKind; item: EntityItem }) {
  const { isAdmin } = useAuth();
  const { t } = useTranslation();
  const { openEditor, reload } = usePortfolio();
  const { message } = App.useApp();

  if (!isAdmin) return null;

  const onDelete = async () => {
    try {
      await api.remove(schemas[kind].endpoint, item.id);
      message.success(t("admin.deleted"));
      await reload();
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  return (
    <span className="inline-flex shrink-0 gap-1">
      <Button size="small" type="text" shape="circle" icon={<EditOutlined />} aria-label={t("common.edit")} onClick={() => openEditor(kind, item)} />
      <Popconfirm title={t("common.confirmDelete")} okText={t("common.yes")} cancelText={t("common.no")} onConfirm={onDelete}>
        <Button size="small" type="text" danger shape="circle" icon={<DeleteOutlined />} aria-label={t("common.remove")} />
      </Popconfirm>
    </span>
  );
}

/** "+ Add" button for a section header. Renders nothing for visitors. */
export function AddButton({ kind }: { kind: ItemKind }) {
  const { isAdmin } = useAuth();
  const { t } = useTranslation();
  const { openEditor } = usePortfolio();
  if (!isAdmin) return null;
  return (
    <Button shape="round" icon={<PlusOutlined />} onClick={() => openEditor(kind)}>
      {t("common.add")}
    </Button>
  );
}
