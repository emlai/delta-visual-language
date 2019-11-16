import * as React from "react";
import {Position} from "./utils";

type Props<T> = {
  items: T[]
  select: (item: T) => void
  position?: Position
};

export function Menu<T extends string>(props: Props<T>) {
  return <div className="Menu" style={props.position && {left: props.position.x, top: props.position.y}}>
    {props.items.map(item =>
      <a href="#" className="MenuItem" onClick={() => props.select(item)} key={item}>
        {item}
      </a>
    )}
  </div>;
}
