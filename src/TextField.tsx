import {Lens} from "./lens";
import * as React from "react";

type Props = {
  value: Lens<string>
  completions?: Array<string>
}

export function TextField(props: Props) {
  return <div className="TextField">
    <input
      value={props.value.get()}
      onChange={event => props.value.set(event.target.value.trimLeft())}
    />
    <div className="completions">
      {props.value.get() && props.completions?.filter(c => c.includes(props.value.get())).map(c =>
        <a href="#" className="completion" onClick={() => props.value.set(c)}>
          {c}
        </a>
      )}
    </div>
  </div>;
}
