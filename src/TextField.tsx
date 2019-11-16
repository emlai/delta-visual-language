import {Lens} from "./lens";
import * as React from "react";

type Props = {
  value: Lens<string>
}

export function TextField(props: Props) {
  return <input
    value={props.value.get()}
    onChange={event => props.value.set(event.target.value)}
  />;
}
