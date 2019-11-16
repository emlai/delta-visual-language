import {Lens} from "./lens";
import * as React from "react";
import {Menu} from "./Menu";

type Props<T> = {
  value: Lens<string>
  completions?: Array<T>
  select: (value: T) => void
}

export function TextField<T extends string>(props: Props<T>) {
  return <div className="TextField">
    <input
      value={props.value.get()}
      onChange={event => props.value.set(event.target.value.trimLeft())}
      autoFocus={true}
    />
    <Menu
      items={props.value.get() && props.completions?.filter(c => c.includes(props.value.get())) || []}
      select={props.select}
    />
  </div>;
}
