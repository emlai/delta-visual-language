import * as React from "react";
import {useState} from "react";
import {TextField} from "./TextField";
import {Lens} from "./lens";
import {Label} from "./Label";

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
    return <Label onClick={() => setEditing(true)}>{props.value.current}</Label>;
  }
}
