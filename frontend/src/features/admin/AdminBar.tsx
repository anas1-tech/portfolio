import { CloudServerOutlined, LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { usePortfolio } from "@/context/PortfolioContext";
import SystemModal from "./SystemModal";

/** Floating pill shown only to the admin. Per-section "Add" buttons live in the sections themselves. */
export default function AdminBar() {
  const { t } = useTranslation();
  const { isAdmin, logout } = useAuth();
  const { openEditor } = usePortfolio();
  const [showSystem, setShowSystem] = useState(false);

  if (!isAdmin) return null;

  return (
    <>
      <div className="glass fixed inset-x-0 bottom-5 z-[60] mx-auto flex w-max max-w-[calc(100%-2rem)] gap-2 rounded-full p-2">
        <Button shape="round" icon={<SettingOutlined />} onClick={() => openEditor("settings")}>
          {t("admin.settings")}
        </Button>
        <Button shape="round" icon={<CloudServerOutlined />} onClick={() => setShowSystem(true)}>
          {t("system.button")}
        </Button>
        <Button shape="round" icon={<LogoutOutlined />} onClick={() => void logout()}>
          {t("auth.logout")}
        </Button>
      </div>
      {showSystem && <SystemModal onClose={() => setShowSystem(false)} />}
    </>
  );
}
