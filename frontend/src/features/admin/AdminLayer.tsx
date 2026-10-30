import { usePortfolio } from "@/context/PortfolioContext";
import AdminBar from "./AdminBar";
import AntdScope from "./AntdScope";
import EntityFormModal from "./EntityFormModal";
import LoginModal from "./LoginModal";

interface AdminLayerProps {
  isAdmin: boolean;
  showLogin: boolean;
  onCloseLogin: () => void;
}

/** Everything floating that belongs to the admin: the bar, the login form and the editor. Lazy-loaded. */
export default function AdminLayer({ isAdmin, showLogin, onCloseLogin }: AdminLayerProps) {
  const { editor } = usePortfolio();
  return (
    <AntdScope>
      {isAdmin && <AdminBar />}
      {showLogin && !isAdmin && <LoginModal onClose={onCloseLogin} />}
      {editor && <EntityFormModal key={`${editor.kind}-${editor.item?.id ?? "new"}`} />}
    </AntdScope>
  );
}
