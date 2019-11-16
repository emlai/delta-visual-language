import {Lens} from "./lens";
import * as React from "react";

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
    <div className="completions">
      {props.value.get() && props.completions?.filter(c => c.includes(props.value.get())).map(c =>
        <a href="#" className="completion" onClick={() => props.select(c)} key={c}>
          {c}
        </a>
      )}
    </div>
  </div>;
}
