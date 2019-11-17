import * as React from "react";
import {useState} from "./hooks";
import {BlockData, BlockType} from "./interpreter";
import {AutocompleteField} from "./AutocompleteField";

type Props = {
  data: BlockData,
  setData: (data: BlockData) => void
};

export function Block(props: Props) {
  const value = useState("");
  const completions: Array<BlockType> = ["prompt", "print"];

  function BlockContent() {
    switch (props.data.type) {
      case "empty":
        return <AutocompleteField
          value={value}
          completions={completions}
          select={type => props.setData({type})}
        />;
      default:
        return <code>{props.data.type}</code>;
    }
  }

  return <div className="Block">
    <BlockContent/>
  </div>;
}
