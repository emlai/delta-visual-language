import {Lens} from "./lens";
import * as React from "react";
import {Menu} from "./Menu";

type Props<T> = {
  value: Lens<string>
  completions?: Array<T>
  select: (value: T) => void
}

export function AutocompleteField<T extends string>(props: Props<T>) {
  const completions = props.completions
    ?.filter(c => c.includes(props.value.current))
    .map(c => ({value: c, label: <code>{c}</code>})) || [];

  return <div className="TextField">
    <code>
      <input
        value={props.value.current}
        onChange={event => props.value.set(event.target.value.trimLeft())}
        autoFocus={true}
      />
    </code>
    <Menu items={completions} select={props.select}/>
  </div>;
}
