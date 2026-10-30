import AntdScope from "./AntdScope";
import { AddButton, ItemControls } from "./ItemControls";

type Props<T extends (props: never) => unknown> = Parameters<T>[0];

/** antd-wrapped versions of the per-item admin controls, loaded only once someone is signed in. */
export function ScopedItemControls(props: Props<typeof ItemControls>) {
  return (
    <AntdScope>
      <ItemControls {...props} />
    </AntdScope>
  );
}

export function ScopedAddButton(props: Props<typeof AddButton>) {
  return (
    <AntdScope>
      <AddButton {...props} />
    </AntdScope>
  );
}
