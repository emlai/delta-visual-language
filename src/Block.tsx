import * as React from "react";
import {TextField} from "./TextField";
import {useState} from "./hooks";

export type BlockType = "prompt" | "print" | "empty";

export function Block() {
  const type = useState<BlockType>("empty");
  const value = useState("");
  const completions: Array<BlockType> = ["prompt", "print"];

  function BlockContent() {
    switch (type.get()) {
      case "empty":
        return <TextField value={value} completions={completions} select={type.set}/>;
      case "prompt":
        return <>prompt</>;
      default:
        return <>{type.get()}</>;
    }
  }

  return <div className="Block">
    <BlockContent/>
  </div>;
}
