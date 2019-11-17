import * as React from "react";
import {useState} from "react";

type Props = {
  value: string
  onChange: (value: string) => void
};

export function TextField(props: Props) {
  const [value, setValue] = useState(props.value);

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      props.onChange(value);
    } else if (event.key === "Escape") {
      setValue(props.value);
      props.onChange(props.value);
    }
  }

  return <input
    className="TextField"
    value={value}
    onChange={event => setValue(event.target.value.trimLeft())}
    onBlur={() => props.onChange(value)}
    onKeyDown={onKeyDown}
  />;
}
