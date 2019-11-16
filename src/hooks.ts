import * as React from "react";
import {Lens} from "./lens";

export function useState<T>(initialValue: T): Lens<T> {
  const [value, set] = React.useState<T>(initialValue);
  return {
    get: () => value,
    set
  };
}
