import * as React from "react";

type Props<T> = {
  items: T[]
  select: (item: T) => void
};

export function Menu<T extends string>(props: Props<T>) {
  return <div className="Menu">
    {props.items.map(item =>
      <a href="#" className="MenuItem" onClick={() => props.select(item)} key={item}>
        {item}
      </a>
    )}
  </div>;
}
