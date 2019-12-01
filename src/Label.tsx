import * as React from "react";
import * as classNames from "classnames";

type Props = {
  children: string;
  onClick?: () => void;
  className?: string;
};

export function Label(props: Props) {
  return (
    <div className={classNames("Label", props.className)} onClick={props.onClick}>
      {props.children}
    </div>
  );
}
