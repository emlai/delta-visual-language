import * as React from "react";

type Props = {
  children: string;
  onClick?: () => void;
};

export function Label(props: Props) {
  return (
    <div className="Label" onClick={props.onClick}>
      {props.children}
    </div>
  );
}
