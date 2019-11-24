import * as React from "react";
import {ReactNode} from "react";
import {useKey} from "react-use";

export type Position = {
  x: number;
  y: number;
};

export type Props = Omit<JSX.IntrinsicElements["div"], "onContextMenu" | "onClick">;

export function useContextMenu(content: ReactNode) {
  const [position, setPosition] = React.useState<Position | null>(null);
  useKey("Escape", close);

  function open(event: React.MouseEvent) {
    if (event.target === event.currentTarget) {
      setPosition({x: event.clientX, y: event.clientY});
    }
  }

  function close() {
    setPosition(null);
  }

  return (props: Props) => (
    <div {...props} onContextMenu={open} onClick={close}>
      {props.children}
      {position && <div style={{position: "absolute", left: position.x, top: position.y, zIndex: 1}}>{content}</div>}
    </div>
  );
}
