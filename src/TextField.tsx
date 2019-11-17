import * as React from "react";
import {useState} from "react";
import {useKey} from "react-use";

type Props = {
  value: string
  onChange: (value: string) => void
};

export function TextField(props: Props) {
  const [value, setValue] = useState(props.value);
  useKey("Enter", () => props.onChange(value));
  useKey("Escape", () => {
    setValue(props.value);
    props.onChange(props.value);
  });

  return <input
    className="TextField"
    value={value}
    onChange={event => setValue(event.target.value.trimLeft())}
    onBlur={() => props.onChange(value)}
  />;
}
