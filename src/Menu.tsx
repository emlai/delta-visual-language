import * as React from "react";
import {ReactNode} from "react";
import {Position} from "./utils";

type Props<T> = {
  items: {value: T, label: ReactNode}[]
  select: (value: T) => void
  position?: Position
};

export function Menu<T extends string>(props: Props<T>) {
  return <div className="Menu" style={props.position && {left: props.position.x, top: props.position.y}}>
    {props.items.map(item =>
      <a href="#" className="MenuItem" onClick={() => props.select(item.value)} key={item.value}>
        {item.label}
      </a>
    )}
  </div>;
}
