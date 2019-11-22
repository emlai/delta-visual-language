import * as React from "react";
import {ReactNode} from "react";

type Props<T> = {
  items: {value: T; label: ReactNode}[];
  select: (value: T) => void;
};

export function Menu<T extends string>(props: Props<T>) {
  return (
    <div className="Menu">
      {props.items.map(item => (
        <a href="#" className="MenuItem" onClick={() => props.select(item.value)} key={item.value}>
          {item.label}
        </a>
      ))}
    </div>
  );
}
