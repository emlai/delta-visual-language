import * as React from "react";
import {TextField} from "./TextField";
import {useState} from "./hooks";

export function Block() {
  const value = useState("");
  const completions = ["prompt", "print"];

  return <div className="Block">
    <TextField value={value} completions={completions}/>
  </div>;
}
