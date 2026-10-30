import { lazy, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import type { EntityItem, EntityKind } from "@/types/api";

type ItemKind = Exclude<EntityKind, "settings">;

// The real controls use antd; they are only fetched after the admin signs in.
const LazyItemControls = lazy(() => import("@/features/admin/AdminSlots").then((m) => ({ default: m.ScopedItemControls })));
const LazyAddButton = lazy(() => import("@/features/admin/AdminSlots").then((m) => ({ default: m.ScopedAddButton })));

/** Edit + delete buttons for one item. Renders nothing for visitors and costs them nothing. */
export function ItemControls({ kind, item }: { kind: ItemKind; item: EntityItem }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return null;
  return (
    <Suspense fallback={null}>
      <LazyItemControls kind={kind} item={item} />
    </Suspense>
  );
}

/** "+ Add" button for a section header. Renders nothing for visitors. */
export function AddButton({ kind }: { kind: ItemKind }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return null;
  return (
    <Suspense fallback={null}>
      <LazyAddButton kind={kind} />
    </Suspense>
  );
}
