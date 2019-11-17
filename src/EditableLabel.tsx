import * as React from "react";
import {useState} from "react";
import {TextField} from "./TextField";
import {Lens} from "./lens";

type Props = {
  value: Lens<string>;
};

export function EditableLabel(props: Props) {
  const [editing, setEditing] = useState(!props.value.current);

  const onChange = (value: string) => {
    props.value.set(value);
    setEditing(!value);
  };

  if (editing) {
    return <TextField value={props.value.current} onChange={onChange} />;
  } else {
    return <div onClick={() => setEditing(true)}>{props.value.current}</div>;
  }
}
